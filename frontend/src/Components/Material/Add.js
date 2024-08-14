import React, {Component} from 'react';
import {connect} from "react-redux";
import InputText from "../Inputs/InputText";
import SubmitButton from "../Inputs/SubmitButton";
import {Editor} from "@tinymce/tinymce-react";
import InputTextarea from '../Inputs/InputTextarea';
import CheckBox from '../Inputs/CheckBox';
import {
    fetchMaterialTags,
    saveMaterial,
    fetchMaterialCategories
}
    from "../../Store/Actions/MaterialsActions";
import DropdownList from '../Inputs/DropdownList/DropdownList';
import ListAutoComplete from '../Inputs/ListAutoComplete/ListAutoComplete';
import InputTag from '../Inputs/InputTag';

class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {

            isFieldEmpty: false,
            isTitleFieldEmpty: false,
            isModelFieldEmpty: false,
            isCategoryFieldEmpty: false,
            isSubmitting: false,
            errors: [],

            material: {
                title: '',
                excerpt: '',
                details: '',
                is_free: true,
                price: [],
                category_id: '',
                tools: [],
                tags: []
            },

            images: [{id: "", is_default: false, image: "", caption: "", excerpt: ""}],
            documents: [{id: "", is_default: false, image: "", caption: "", excerpt: ""}],
            videos: [{id: "", is_default: false, image: "", caption: "", excerpt: ""}],

            previewImages: [],
            previewDocuments: []

        }

        this.tagHandler = this.tagHandler.bind(this);

        this.onSelectModel = this.onSelectModel.bind(this);
        this.checkAllModels = this.checkAllModels.bind(this);
        this.uncheckAllModels = this.uncheckAllModels.bind(this);

        this.addImage = this.addImage.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.handleImagesInputs = this.handleImagesInputs.bind(this);

        this.addDoc = this.addDoc.bind(this);
        this.removeDoc = this.removeDoc.bind(this);
        this.handleDocInputs = this.handleDocInputs.bind(this);

        //for videos
        this.addVideo = this.addVideo.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.handleVideoInputs = this.handleVideoInputs.bind(this);

        this.props.fetchMaterialTags();

    }

    componentDidMount() {

        //fetch caterogies if not in state
        if (this.props.categories?.length == 0)
            this.props.fetchMaterialCategories();


        const prices = Object.keys(this.props.allCurrencies).map(c => {
            return {currency: c, price: 0}
        });

        const {material} = this.state;
        material.price = prices;
        this.setState({material: material});
    }

    tagHandler(action, tag, e) {

        const {material} = this.state;
        let {tags} = material;

        if (action == 'add')
            tags.push(tag);
        else if (action == 'delete')
            tags = tags.filter((item, i) => i != tag); // tag as index
        else if (action == 'backspace')
            tags.pop();

        material.tags = tags;
        this.setState({
            material: material
        });

    }

    checkAllModels() {

        const {material} = this.state;
        material.tools = this.props.tools.map(x => x.id);
        this.setState({material: material})
    }

    uncheckAllModels() {

        const {material} = this.state;
        material.tools = [];
        this.setState({material: material})
    }

    onSelectModel(value, name) {

        const {material} = this.state;
        let {tools} = material;

        if (value == true)
            tools.push(name)
        else
            tools = tools.filter(x => x != name);

        material.tools = tools;
        this.setState({
            material: material,
            isModelFieldEmpty: !tools.length
        });
    }

    categoryChangeHandler(name, id) {

        const {material} = this.state;
        material.category_id = id;

        this.setState({
            material: material,
            isCategoryFieldEmpty: !Boolean(material.category_id)
        });
    }

    onEditorChangeHandler(content, editor) {


        const {material} = this.state;
        material.details = content;

        this.setState({material: material});
    }

    onPriceChangeHandler(inputTarget) {

        const {material} = this.state;

        const {name, value} = inputTarget;
        const price = {price: value, currency: name};

        const found = this.state.material.price.findIndex(e => e.currency === name);

        if (found !== -1) {
            material.price[found].price = value;
        } else {
            material.price = [...material.price, price]
        }

        this.setState({material: material});


    }

    onChangeHandler(inputTarget) {

        const {name, value} = inputTarget;

        const {material} = this.state;
        material[name] = value;

        this.setState({
            material: material,
            isTitleFieldEmpty: name === 'title' && !Boolean(value),
            isFieldEmpty: name === 'title' && !Boolean(value)
        });
    }

    async submitHandler(e) {

        e.preventDefault();
        this.setState({isSubmitted: true})


        if (this.state.material.title == ''
            || this.state.material.category_id == ''
            || this.state.material.tools.length == 0
        ) {
            this.setState({
                ...this.state,
                isTitleFieldEmpty: !Boolean(this.state.material.title),
                isCategoryFieldEmpty: !Boolean(this.state.material.category_id),
                isModelFieldEmpty: !this.state.material.tools.length,
                isSubmitted: false
            })
            return false;
        }


        //save materials

        const data = this.state.material;

        let formData = new FormData();
        const arrayKeys = ['price', 'tags'];
        for (let key in data) {
            const value = arrayKeys.includes(key) ? JSON.stringify(data[key]) : data[key] || '';
            formData.append(key, value);

        }

        let i = 0;
        const checkNull = value => (!Boolean(value) || value == 'null') ? '' : value;
        //for image
        this.state.images.forEach((item, idx) => {
            if (item.image) {
                formData.append("resources[images][" + i + "][id]", item.id);
                formData.append("resources[images][" + i + "][is_default]", item.is_default);
                formData.append("resources[images][" + i + "][image]", item.image);
                formData.append("resources[images][" + i + "][caption]", checkNull(item.caption));
                formData.append("resources[images][" + i + "][excerpt]", checkNull(item.excerpt));
                i++;
            }
        });

        //for documents
        this.state.documents.forEach((item, idx) => {
            if (item.image) {
                formData.append("resources[documents][" + i + "][id]", item.id);
                formData.append("resources[documents][" + i + "][is_default]", 'false');
                formData.append("resources[documents][" + i + "][image]", item.image);
                formData.append("resources[documents][" + i + "][caption]", checkNull(item.caption));
                formData.append("resources[documents][" + i + "][excerpt]", checkNull(item.excerpt));
                i++;
            }
        });

        //for documents
        this.state.videos.forEach((item, idx) => {
            if (item.image) {
                formData.append("resources[videos][" + i + "][id]", item.id);
                formData.append("resources[videos][" + i + "][is_default]", 'false');
                formData.append("resources[videos][" + i + "][image]", item.image);
                formData.append("resources[videos][" + i + "][caption]", checkNull(item.caption));
                formData.append("resources[videos][" + i + "][excerpt]", checkNull(item.excerpt));
                i++;
            }
        });


        data.resources = formData;

        this.props.saveMaterial(formData)
            .then((response) => {
                this.setState({isSubmitted: false});

                const material = response.data.data;
                setTimeout(() => {
                    this.props.history.push({
                        pathname: '/admin/at_materials/' + material.id
                    });
                }, 3000);
            })
            .catch((err) => {
                this.setState({errors: err.data, isSubmitted: false});
            });


        return false;
    }

    isFreeHanlder(val) {

        const {material} = this.state;
        material.is_free = !val;
        this.setState({material: material});
    }

    addImage(e) {

        e.preventDefault();
        this.setState((prevState) => ({
            images: [...prevState.images, {is_default: false, image: "", caption: "", excerpt: ""}]
        }));
    }

    handleImagesInputs(e) {

        const {t} = this.props;

        this.setState({
            ...this.state,
            imageSizeError: undefined,
            fileSizeError: undefined,
        })


        if ( Boolean(e.target.files) && e.target?.files[0]?.size > 2097152) {
            e.target.value = null
            this.setState({
                ...this.state,
                imageSizeError: t('file_size_should_not_be_more_than_2mb'),
                isSubmitted: false
            })

            return false;
        }

        if (['is_default'].includes(e.target.dataset.name)) {

            let images = [...this.state.images];
            images = images.map((img, idx) => {
                const value = idx == e.target.dataset.id ? true : false;
                img.is_default = value;

                return img;
            })

            this.setState({images}, () => console.log(this.state.images));
        }

        if (['caption', 'excerpt'].includes(e.target.dataset.name)) {

            let images = [...this.state.images];
            images[e.target.dataset.id][e.target.dataset.name] = e.target.value;
            this.setState({images}, () => console.log(this.state.images));
        }

        if (['image'].includes(e.target.dataset.name)) {
            let previewImages = [...this.state.previewImages];
            previewImages[e.target.dataset.id] = URL.createObjectURL(e.target.files[0]);
            this.setState({previewImages}, () => console.log(this.state.previewImages));

            let images = [...this.state.images];
            images[e.target.dataset.id][e.target.dataset.name] = e.target.files[0];
            this.setState({images}, () => console.log(this.state.images));
        }


    }

    removeImage(e) {

        e.preventDefault();
        const idx = e.target.dataset.id;
        let images = [...this.state.images];

        images = images.filter((item, i) => i != idx);
        const previewImages = this.state.previewImages.filter((item, i) => i != idx)

        this.setState({images: images, previewImages: previewImages});
    }


    addDoc(e) {

        e.preventDefault();
        this.setState((prevState) => ({
            documents: [...prevState.documents, {is_default: false, image: "", caption: "", excerpt: ""}]
        }));
    }

    handleDocInputs(e) {

        const {t} = this.props;

        this.setState({
            ...this.state,
            imageSizeError: undefined,
            fileSizeError: undefined,
        })

        if ( Boolean(e.target.files) && e.target?.files[0]?.size > 2097152) {
            e.target.value = null
            this.setState({
                ...this.state,
                fileSizeError: t('file_size_should_not_be_more_than_2mb'),
                isSubmitted: false
            })

            return false;
        }


        if (['caption', 'excerpt'].includes(e.target.dataset.name)) {

            let documents = [...this.state.documents];
            documents[e.target.dataset.id][e.target.dataset.name] = e.target.value;
            this.setState({documents}, () => console.log(this.state.documents));
        }

        if (['image'].includes(e.target.dataset.name)) {

            let previewDocuments = [...this.state.previewDocuments];
            previewDocuments[e.target.dataset.id] = URL.createObjectURL(e.target.files[0]);
            this.setState({previewDocuments}, () => console.log(this.state.previewDocuments));

            let documents = [...this.state.documents];
            documents[e.target.dataset.id][e.target.dataset.name] = e.target.files[0];
            this.setState({documents}, () => console.log(this.state.documents));
        }


    }

    removeDoc(e) {

        e.preventDefault();
        const idx = e.target.dataset.id;
        let documents = [...this.state.documents];
        documents = documents.filter((item, i) => i != idx);
        this.setState({documents: documents});
    }


    addVideo(e) {
        e.preventDefault();
        this.setState((prevState) => ({
            videos: [...prevState.videos, {is_default: false, image: "", caption: "", excerpt: ""}]
        }));
    }

    handleVideoInputs(e) {


        if (['image', 'caption', 'excerpt'].includes(e.target.dataset.name)) {

            let videos = [...this.state.videos];
            videos[e.target.dataset.id][e.target.dataset.name] = e.target.value;
            this.setState({videos}, () => console.log(this.state.videos));
        }

    }

    removeVideo(e) {

        e.preventDefault();

        const idx = e.target.dataset.id;
        let videos = [...this.state.videos];

        videos = videos.filter((item, i) => i != idx);

        this.setState({videos: videos});
    }

    getCaption(img, index) {

        let caption = img.caption;

        if (!Boolean(caption) && Boolean(img.image)) {

            if (typeof img.image === 'object') {
                caption = img.image.name;
            } else if (typeof img.image === 'string') {
                caption = [...img.image.split('/')].pop();
            }
        }

        return caption;
    }

    render() {

        const {t} = this.props;

        const emptyMessage = this.state.isTitleFieldEmpty === true ?
            <p className="at2_error_text">{t('title_not_be_empty')}</p> : '';
        const catEmptyMessage = this.state.isCategoryFieldEmpty === true ?
            <p className="at2_error_text">{t('select_category')}</p> : '';
        const modelEmptyMessage = this.state.isModelFieldEmpty === true ?
            <p className="at2_error_text">{t('select_model')}</p> : '';

        const {material, errors} = this.state;

        const categories = this.props.categories.map((item, i) => {
            return {
                id: item.id,
                name: item.name
            }
        });
        const selectedCategory = material.category_id;

        const {images, documents, videos} = this.state;
        const {tools, tags} = this.props;


        return (
            <div className="content-block mb-3 large-v-gap">
                <form onSubmit={e => this.submitHandler(e)} autoComplete="no">
                    <div className="row">
                        <div className="col- col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            <div className="content-block-grey">
                                <div className="form_sub_heading">{t('add_material')}</div>

                                <div className="row">
                                    <div className="col">
                                        <InputText
                                            fieldName="title"
                                            fieldClass="title"
                                            fieldID="title"
                                            fieldPlaceholder={t('title')}
                                            fieldValue={material.title}
                                            isFieldEmpty={this.state.isTitleFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)}/>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <InputTextarea
                                            fieldName="excerpt"
                                            fieldClass="excerpt"
                                            fieldID="excerpt"
                                            fieldPlaceholder={t('excerpt')}
                                            fieldValue={material.excerpt}
                                            fieldOnChange={this.onChangeHandler.bind(this)}/>
                                    </div>
                                </div>

                                <br/>
                                <div className="row">
                                    <div className="col">
                                        <InputTag tagHandler={this.tagHandler} selectedTags={material.tags}
                                                  tags={tags}/>
                                    </div>
                                </div>

                                <br/>
                                <div className="row">
                                    <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-6">


                                        <div
                                            className={this.state.isCategoryFieldEmpty ? 'form-control is-invalid h-75' : ''}>
                                            <ListAutoComplete
                                                fullSearch={true}
                                                isFieldEmpty={this.state.isEmptyLocationID}
                                                fieldName="category_id"
                                                fieldPlaceHolder={t('select_category')}
                                                fieldOnClick={this.categoryChangeHandler.bind(this)}
                                                selectedItemId={selectedCategory}
                                                listData={categories}/>
                                        </div>


                                    </div>
                                    <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-6">

                                        <CheckBox
                                            fieldValue={!material.is_free}
                                            checkUncheckHandler={e => this.isFreeHanlder(e)}
                                            fieldName="is_free"
                                            text={t('is_paid')}/>

                                        {!material.is_free && <div className="company_form_password">


                                            {
                                                material.price.map((c, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <div className="row">
                                                                <div className="col">
                                                                    <InputText
                                                                        fieldName={c.currency}
                                                                        fieldPlaceholder={c.currency + ' ' + t('amount')}
                                                                        fieldOnChange={this.onPriceChangeHandler.bind(this)}/>
                                                                </div>
                                                            </div>

                                                        </div>

                                                    );
                                                })

                                            }

                                        </div>

                                        }

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12">

                                        <div className={this.state.isModelFieldEmpty ? 'form-control is-invalid' : ''}>
                                            <div className='modelsselector'>
                                                <strong>{t('models')} *</strong>
                                                <span style={{cursor: 'pointer'}}>
                                                    {tools.length !== this.state.material.tools.length &&
                                                    <i onClick={this.checkAllModels} className="fa fa-check ml-2"></i>}
                                                    {tools.length == this.state.material.tools.length &&
                                                    <i onClick={this.uncheckAllModels}
                                                       className="fa fa-times ml-2"></i>}
                                                </span>
                                                <br/>
                                                {tools.map((tool, i) => {

                                                    return (
                                                        <CheckBox
                                                            key={'tools' + tool.id}
                                                            checkUncheckHandler={this.onSelectModel}
                                                            fieldName={tool.id}
                                                            fieldValue={material.tools.find(x => x == tool.id)}
                                                            text={tool.name}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <br/>
                                <Editor
                                    value={this.state.content}
                                    init={{
                                        height: 300,
                                        menubar: false
                                    }}
                                    onEditorChange={this.onEditorChangeHandler.bind(this)}
                                />


                            </div>

                            {emptyMessage}
                            {catEmptyMessage}
                            {modelEmptyMessage}
                            {
                                Object.keys(errors).length > 0 && <div className="at2_error_text">

                                    <ul>
                                        {
                                            Object.keys(errors).map(k => errors[k].map(x => <li>{x}</li>))
                                        }
                                    </ul>
                                </div>
                            }

                            <div className="btn_wrapper">
                                <SubmitButton
                                    buttonDisabled={this.state.isSubmitted}
                                    btnText={t('save')}/>
                            </div>
                        </div>

                        <div className="col- col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            <div className="content-block-grey">
                                {/* add image */}
                                <br/>
                                <div className="row">
                                    <div className=" col form_sub_heading pl-3">
                                        {t('add') + ' ' + t('images')}
                                        <small className="text-muted"> ( png,
                                            jpg,jpeg,gif, {t('max_upload_limit')} )</small>
                                    </div>
                                    <div className="col-md-3 align-right">
                                        <button onClick={this.addImage} className="float-right btn "
                                                style={{'backgroundColor': '#102640', 'color': '#fff'}}>
                                            {t('add_new')}
                                        </button>
                                    </div>

                                </div>


                                {
                                    images.map((img, idx) => {

                                        let imgId = `img-${idx}`, capId = `cap-${idx}`, excerptId = `excerpt-${idx}`,
                                            isDefaultId = `isDefault`;

                                        return (
                                            <div key={idx} className="row my-2">
                                                <div className="col-md-4">
                                                    <div className="row">
                                                        <div className="col-md-1">
                                                            <div className="form-check">
                                                                <input
                                                                    type="radio"
                                                                    name={isDefaultId}
                                                                    data-id={idx}
                                                                    data-name="is_default"
                                                                    className="form-check-input"
                                                                    onChange={this.handleImagesInputs}
                                                                />
                                                                <label className="form-check-label"></label>
                                                            </div>

                                                        </div>

                                                        <div className="col">

                                                            <input
                                                                type="file"
                                                                name={imgId}
                                                                data-id={idx}
                                                                data-name="image"
                                                                id={imgId}
                                                                className="form-control-file"
                                                                onChange={this.handleImagesInputs}
                                                                accept="image/*"

                                                            />

                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-1"></div>
                                                        <div className="col">
                                                            {this.state.previewImages[idx] &&
                                                            <img width="150" height="100" className="rounded mt-2"
                                                                 src={this.state.previewImages[idx]}/>}
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        name={capId}
                                                        data-id={idx}
                                                        data-name="caption"
                                                        id={capId}
                                                        className=" form-control"
                                                        onChange={this.handleImagesInputs}
                                                        placeholder={t('caption')}
                                                        value={img.caption}
                                                    />
                                                </div>

                                                <div className="col">

                                                    <div className="row no-gutters">
                                                        <div className="col">
                                                            <textarea

                                                                name={excerptId}
                                                                data-id={idx}
                                                                data-name="excerpt"
                                                                id={excerptId}
                                                                className="form-control"
                                                                rows="1"
                                                                onChange={this.handleImagesInputs}
                                                                placeholder={t('excerpt')}
                                                                value={img.excerpt}

                                                            ></textarea>
                                                        </div>
                                                        <div className=" col-md-2 ">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary-outline at2-btn-no-bg text-center ml-2">
                                                                <img
                                                                    data-id={idx}
                                                                    onClick={e => this.removeImage(e)}
                                                                    src="images/remove_icon.svg"/>

                                                            </button>
                                                        </div>
                                                    </div>

                                                </div>


                                            </div>
                                        )

                                    })
                                }

                                {this.state?.imageSizeError && <p className="at2_error_text">{this.state.imageSizeError}</p>}

                                {/* add documents */}
                                <br/>
                                <div className="row">
                                    <div className=" col form_sub_heading pl-3">
                                        {t('add') + ' ' + t('documents')}
                                        <small className="text-muted"> (
                                            pdf,doc,docx,ppt,pptx, {t('max_upload_limit')})</small>
                                    </div>
                                    <div className="col-md-3 align-right">
                                        <button onClick={this.addDoc} className="float-right btn "
                                                style={{'backgroundColor': '#102640', 'color': '#fff'}}>
                                            {t('add_new')}
                                        </button>
                                    </div>

                                </div>


                                {
                                    documents.map((img, idx) => {

                                        let imgId = `dimg-${idx}`, capId = `dcap-${idx}`, excerptId = `dexcerpt-${idx}`;
                                        let caption = this.getCaption(img, idx);
                                        return (
                                            <div key={idx} className="row my-2">

                                                <div className="col-md-4">
                                                    <div className="row">

                                                        <div className="col-md-1">
                                                            <div className="form-check">

                                                            </div>

                                                        </div>


                                                        <div className="col-md-10">
                                                            <input
                                                                type="file"
                                                                name={imgId}
                                                                data-id={idx}
                                                                data-name="image"
                                                                id={imgId}
                                                                className="form-control-file"
                                                                onChange={this.handleDocInputs}
                                                                accept=".pdf,.ppt,.pptx,.doc,.docx"

                                                            />
                                                            {
                                                                this.state.previewDocuments[idx] &&
                                                                <a target="__blank"
                                                                   href={this.state.previewDocuments[idx]}>
                                                                    <u>{caption}</u>
                                                                </a>
                                                            }

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        name={capId}
                                                        data-id={idx}
                                                        data-name="caption"
                                                        id={capId}
                                                        className=" form-control"
                                                        onChange={this.handleDocInputs}
                                                        placeholder={t('caption')}
                                                        value={img?.caption}
                                                    />
                                                </div>

                                                <div className="col">

                                                    <div className="row no-gutters">
                                                        <div className="col">
                                                            <textarea

                                                                name={excerptId}
                                                                data-id={idx}
                                                                data-name="excerpt"
                                                                id={excerptId}
                                                                className=" form-control"
                                                                rows="1"
                                                                onChange={this.handleDocInputs}
                                                                placeholder={t('excerpt')}
                                                                value={img?.excerpt}


                                                            ></textarea>
                                                        </div>
                                                        <div className=" col-md-2 ">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary-outline at2-btn-no-bg ml-2">
                                                                <img
                                                                    data-id={idx}
                                                                    onClick={e => this.removeDoc(e)}
                                                                    src="images/remove_icon.svg"/>

                                                            </button>
                                                        </div>
                                                    </div>

                                                </div>


                                            </div>
                                        )

                                    })
                                }

                                {this.state?.fileSizeError && <p className="at2_error_text">{this.state.fileSizeError}</p>}


                                {/* add videos */}
                                <br/>
                                <div className="row">
                                    <div
                                        className=" col-md-6 form_sub_heading pl-3">{t('add') + ' ' + t('vimeo_videos')}</div>
                                    <div className="col-md-6 align-right">
                                        <button onClick={this.addVideo} className="float-right btn "
                                                style={{'backgroundColor': '#102640', 'color': '#fff'}}>
                                            {t('add_new')}
                                        </button>
                                    </div>

                                </div>


                                {
                                    videos.map((img, idx) => {

                                        let imgId = `vimg-${idx}`, capId = `vcap-${idx}`, excerptId = `vexcerpt-${idx}`;

                                        return (
                                            <div key={idx} className="row my-2">

                                                <div className="col-md-4">
                                                    <div className="row">

                                                        <div className="col-md-1">
                                                            <div className="form-check">

                                                            </div>

                                                        </div>

                                                        <div className="col">
                                                            <input
                                                                type="text"
                                                                name={imgId}
                                                                data-id={idx}
                                                                data-name="image"
                                                                id={imgId}
                                                                className="form-control"
                                                                onChange={this.handleVideoInputs}
                                                                placeholder={t('vimeo_video_id')}
                                                                value={img.image}

                                                            />

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        name={capId}
                                                        data-id={idx}
                                                        data-name="caption"
                                                        id={capId}
                                                        className=" form-control"
                                                        onChange={this.handleVideoInputs}
                                                        placeholder={t('caption')}
                                                        value={img.caption}
                                                    />
                                                </div>

                                                <div className="col">

                                                    <div className="row no-gutters">
                                                        <div className="col">
                                                            <textarea

                                                                name={excerptId}
                                                                data-id={idx}
                                                                data-name="excerpt"
                                                                id={excerptId}
                                                                className="form-control"
                                                                rows="1"
                                                                onChange={this.handleVideoInputs}
                                                                placeholder={t('excerpt')}
                                                                value={img.excerpt}
                                                            ></textarea>
                                                        </div>
                                                        <div className=" col-md-2 ">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary-outline at2-btn-no-bg ml-2">

                                                                <img
                                                                    data-id={idx}
                                                                    onClick={e => this.removeVideo(e)}
                                                                    src="images/remove_icon.svg"/>

                                                            </button>
                                                        </div>
                                                    </div>

                                                </div>


                                            </div>
                                        )

                                    })
                                }
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    allCurrencies: state.company.currencySymbols,
    categories: state.materials.categories,
    tags: state.materials.tags,
    tools: state.modelSettings.data
});


export default connect(mapStateToProps, {
    saveMaterial,
    fetchMaterialCategories,
    fetchMaterialTags
})(Add);
