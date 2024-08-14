import React, {useEffect, useState} from 'react';
import '../popup.css';
import {withTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {showTemplateNotesPopup} from "../../../Store/Actions/popupActions";
import {Editor} from "@tinymce/tinymce-react";

import {getTemplateNote, saveTemplateNote, updateTemplateNote} from "../../../Store/Actions/TemplateNoteActions";
import CancelButton from "../../Inputs/CancelButton";

const TemplateNotesPopup = ({t}) => {
    const [modulePopupHeight, setModulePopupHeight] = useState(0)
    const dispatch = useDispatch()
    const selectedTemplate = useSelector(state => state?.template?.selectedTemplate || {})
    const templateName = useSelector(state => state?.template?.selectedTemplate?.name || '')
    const templateID = useSelector(state => state.template.selectedTemplate.id)
    const notes = useSelector(state => state?.template?.selectedTemplate?.notes || '')
    const noteID = useSelector(state => state?.template?.selectedTemplate?.noteID || false)
    const userID = useSelector(state => state.auth.data.user.id)
    const spinner = useSelector(state => state?.spinner?.contentSpinner || undefined)
    const [tNotes, setTNotes] = useState(notes)
    const [mode, setMode] = useState(notes === '' && 'edit' || 'view')

    const [editIcon, setEditIcon] = useState(false)
    const [tickIcon, setTickIcon] = useState(false)

    useEffect(() => {
        setModulePopupHeight(document.getElementById('at2_template_notes_popup').offsetHeight)
        dispatch(getTemplateNote(selectedTemplate, {template_id: templateID}))
        setMode(notes === '' && 'edit' || 'view')
        setTNotes(notes)

    }, [notes])

    const onEditorChangeHandler = (notes, editor) => {
        setTNotes(notes)
    }

    const saveNotes = () => {
        const data = {
            notes: tNotes,
            template_id: templateID,
            user_id: userID
        }
        dispatch(saveTemplateNote(selectedTemplate, data))
    }

    const updateNotes = () => {
        const data = {
            id: noteID,
            notes: tNotes,
            template_id: templateID,
            user_id: userID
        }
        dispatch(updateTemplateNote(selectedTemplate, data))
    }

    const popupTopMargin = modulePopupHeight / 2;

    return <div id="at2_popup">
        <div className="popup_box template_notes_popup" id="at2_template_notes_popup"
             style={{marginTop: -popupTopMargin + 'px'}}>
            <i
                onClick={e => dispatch(showTemplateNotesPopup(false))}
                className="fa fa-times popup_close"></i>

            <h3>{t('notes_for_template') + ' "' + templateName + '"'}</h3>

            <div className="form-row mt-3">
                <div className="col-lg-12">
                    <div
                        onMouseLeave={e => setEditIcon(false)}
                        className="position-relative" id="templates_notes_wrap">
                        {(Boolean(selectedTemplate.hasWriteAccess) && editIcon && tNotes !== '') &&
                        <i onClick={() => setMode('edit')}
                           title={'edit_notes'}
                           className="fa fa-pencil thinner cursor_pointer template_edit"/>}
                        {(mode === 'view') && <div onMouseOver={() => setEditIcon(true)}
                                                   className="p-3 bg-white view_mode"
                                                   dangerouslySetInnerHTML={{__html: tNotes}}/>}

                        {(mode === 'edit') && <Editor
                            disabled={!Boolean(selectedTemplate.hasWriteAccess)}
                            value={tNotes}
                            init={{
                                height: 300,
                                menubar: false,
                                plugins: ["link image media"],
                                toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
                                toolbar2: "image media | cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor code | insertdatetime preview | forecolor backcolor",
                                images_upload_url: '/api/tool/upload',
                                convert_urls: false,
                                file_picker_type: 'file image media',
                                automatic_uploads: true,
                                file_picker_callback: function (cb, value, meta) {
                                    const input = document.createElement('input');
                                    input.setAttribute('type', 'file');
                                    input.setAttribute('accept', 'image/*');
                                    input.onchange = function () {
                                        var file = this.files[0];
                                        var reader = new FileReader();
                                        reader.readAsDataURL(file);
                                        reader.onload = function () {
                                            let tinymce = tinymce.init({})
                                            var id = 'blobid' + (new Date()).getTime();
                                            var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                                            var base64 = reader.result.split(',')[1];
                                            var blobInfo = blobCache.create(id, file, base64);
                                            blobCache.add(blobInfo);

                                            /* call the callback and populate the Title field with the file name */
                                            cb(blobInfo.blobUri(), {title: file.name});
                                        }
                                    }
                                    input.click();
                                }

                            }}
                            onInit={() => {
                                setModulePopupHeight(document.getElementById('at2_template_notes_popup').offsetHeight)
                            }}
                            onEditorChange={onEditorChangeHandler}
                        />}
                    </div>
                </div>
                <div className="col-lg-6">
                    {spinner && 'Saving...'}
                </div>
                {(Boolean(selectedTemplate.hasWriteAccess) && mode === 'edit') && <div className="col-lg-6 text-right">
                    { noteID && <button
                        onClick={ () => setMode('view')}
                        type="button"
                        className="btn btn-primary default-btn-atv2 mt-3 mr-2">
                        <i
                            className="fa fa-times blue-stroke"
                            aria-hidden="true"></i>
                        Cancel
                    </button> }
                    {!noteID && <button
                        type="submit"
                        onClick={saveNotes}
                        className="btn btn-primary default-btn-atv2 mt-3">
                        Save
                    </button>}
                    {noteID && <button
                        type="submit"
                        onClick={updateNotes}
                        className="btn btn-primary default-btn-atv2 mt-3">
                        Update
                    </button>}
                </div>
                }
            </div>

        </div>
    </div>;
}

export default (withTranslation()(TemplateNotesPopup));

