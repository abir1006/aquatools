import React from 'react'
import InputText from '../Inputs/InputText'
import SubmitButton from '../Inputs/SubmitButton'

const CategoryAdd = (props) => {

    const { name, error } = props.stateParams;
    const { t } = props;

    return (
        <div>
            <form onSubmit={e => props.createHandler(e)} autoComplete="no">
                <div className="content-block mb-3">
                    <div className="row">
                        <div className="col- col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            <div className="content-block-grey">
                                <div className="form_sub_heading">{t('add') + ' ' + t('category')}</div>


                                <InputText
                                    fieldName="title"
                                    fieldClass="title"
                                    fieldID="title"
                                    fieldPlaceholder={t('name')}
                                    fieldValue={name}
                                    isFieldEmpty={Boolean(error)}
                                    fieldOnChange={props.nameChangeHandler} />
                                {error && <p className="at2_error_text">{error}</p>}

                                <div className="btn_wrapper">
                                    {
                                        (!Boolean(error) && Boolean(name)) && <SubmitButton
                                            buttonDisabled={false}
                                            btnText={t('save')}

                                        />
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>

    )
}

export default CategoryAdd
