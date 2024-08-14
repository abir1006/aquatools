import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { renameTemplate } from '../../Store/Actions/TemplateActions';

const InlineEdit = ({ template, renameTemplate, t }) => {


    const { name, id } = template;

    const [hoverRow, setHoverRow] = useState('');
    const [clickedRow, setClickedRow] = useState('');
    let [title, setTitle] = useState(name);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState("");

    useEffect(() => {
        setTitle(name);
    }, [name])

    const onChangeTitle = (e) => {
        const { name, value } = e.target;
        setTitle(value);
        setErrors("");
    }

    const updateTitle = async (e) => {

        setSubmitting(true);
        renameTemplate(id, title)
            .then(res => resetValues())
            .catch(e => {
                console.log(e.response.data);
                setErrors(e.response.data);
                setSubmitting(false);
            })
    }

    const resetValues = () => {
        setClickedRow("");
        setHoverRow("");
        setSubmitting(false);
        setErrors("");
    }

    let error = '';
    if (!Boolean(title))
        error = t('fields_empty_message');
    else if (Boolean(errors))
        error = t('template_name_already_exist');


    if (hoverRow !== id)
        return (
            <div onMouseOver={e => setHoverRow(id)}>
                {title}
            </div>
        )


    return (
        <div>
            {hoverRow === id && !Boolean(clickedRow) &&
                <div onMouseLeave={e => setHoverRow('')} className="d-flex align-items-center">
                    {title}
                    <i
                        style={{ cursor: 'pointer' }}
                        onClick={e => { setClickedRow(id); }}
                        className="ml-2 fa fa-edit"
                        aria-hidden="true">
                    </i>
                </div>
            }

            {clickedRow === id &&
                <>
                    <div className="d-flex align-items-center">
                        <input
                            onChange={e => onChangeTitle(e)}
                            style={{ border: !Boolean(error) ? '1px solid gray' : '1px solid red', height: '99%', outline: 'none' }}
                            className="p-1 is-valid w-75 "
                            type="text"
                            value={title}
                            name="title"
                        />

                        {
                            Boolean(title) && !submitting && <i
                                style={{ cursor: 'pointer' }}
                                onClick={e => { }}
                                className="ml-2 fa fa-check"
                                aria-hidden="true"
                                onClick={e => updateTitle(e)}
                            >
                            </i>
                        }

                        {submitting && <span className="ml-2 spinner-border spinner-border-sm mr-1" />}

                        {!submitting &&
                            <i
                                style={{ cursor: 'pointer' }}
                                onClick={e => { }}
                                className="ml-2 fa fa-close"
                                aria-hidden="true"
                                onClick={e => { resetValues(); setTitle(template.name); }}
                            >

                            </i>
                        }

                    </div>
                    <div class="text-danger">{error}</div>
                </>
            }
        </div >
    )
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {
    renameTemplate
})(withTranslation()(InlineEdit));
