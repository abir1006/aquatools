import React, { useState } from 'react'
import { withTranslation } from 'react-i18next';
import './InputTag.css'

const InputTag = (props) => {

    const [input, setInput] = useState('');
    const [isKeyReleased, setIsKeyReleased] = useState(false);

    let fieldClass = props.isFieldEmpty === true ? 'is-invalid tag-input' : 'tag-input';

    const { tags = [], selectedTags = [], tagHandler } = props;
    const delimeterKeys = [',', 'Enter']

    const onChange = (e) => {
        const { value } = e.target;
        setInput(value);
    };

    const onKeyDown = (e) => {

        const { key } = e;
        const trimmedInput = input.trim();

        if (delimeterKeys.includes(key) && trimmedInput.length && !selectedTags.find(x => x.name == trimmedInput)) {
            e.preventDefault();
            let tag = tags.find(x => x.name.toLowerCase() === trimmedInput.toLocaleLowerCase());
            tag = Boolean(tag) ? { id: tag.id, name: tag.name } : { id: "", name: trimmedInput };
            tagHandler('add', tag, e);
            setInput('');

        }

        if (key === "Backspace" && !input.length && selectedTags.length && isKeyReleased) {
            const tagsCopy = [...selectedTags];
            const poppedTag = tagsCopy.pop();
            e.preventDefault();
            tagHandler('backspace', { id: poppedTag.id, name: poppedTag.name }, e);
            setInput(poppedTag.name);
        }

        setIsKeyReleased(false);

    };

    const onKeyUp = () => {
        setIsKeyReleased(true);
    }

    const deleteTag = (e, index) => {
        e.preventDefault();
        tagHandler('delete', index, e);

    }

    const onSelectTag = (e, tag) => {
        e.preventDefault();
        tagHandler('add', { id: tag.id, name: tag.name }, e);
        setInput('');
    }

    const filteredTags = tags.filter(x => !selectedTags.find(y => y.name == x.name)).filter(x => x.name.includes(input));

    const renderList = () => {
        return filteredTags.map((tag) => (
            <li key={tag.id} onClick={(e) => onSelectTag(e, tag)} className="list-group-item border-bottom" data-id={tag.id}>{tag.name}</li>
        ))
    };

    const { t } = props;

    return (
        <div className="tag-wrapper">
            <div className="tag-field">
                {selectedTags.map((tag, index) => (
                    <div className="tag badge badge-gray px-2 py-0" key={index}>
                        {tag.name}

                        <button className="tag-close" onClick={(e) => deleteTag(e, index)}>x</button>

                    </div>
                ))}
                <div>
                    <input
                        className={fieldClass}
                        value={input}
                        placeholder={t('enter_a_tag')}
                        onKeyUp={onKeyUp}
                        onKeyDown={onKeyDown}
                        onChange={onChange}
                    />
                    {filteredTags.length > 0 && input &&
                        <ul className="list-group">
                            {renderList()}
                        </ul>
                    }
                </div>
            </div>
        </div>
    )
}

export default withTranslation()(InputTag)
