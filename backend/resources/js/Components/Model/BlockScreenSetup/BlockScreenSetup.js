import React, {useRef, useEffect} from 'react';
import {connect} from 'react-redux';
import './BlockScreenSetup.css';
import {
    toggleMTBBlockList,
    showHideModelScreenBlocks,
    setModelScreenInputs,
    setModelResult,
    hideMTBBlockList,
    setBlockScrollHeight
} from "../../../Store/Actions/MTBActions";
import {setFeedModelResult} from "../../../Store/Actions/FeedModelActions";
import {setOptModelResult} from "../../../Store/Actions/OptModelActions";
import {setGeneticsModelResult} from "../../../Store/Actions/GeneticsModelActions";
import CheckBox from "../../Inputs/CheckBox";
import {withTranslation} from 'react-i18next';


const BlockScreenSetup = props => {


    useEffect(() => {
        const scrollHeight = document.documentElement.offsetHeight - document.getElementById('block_screen_setup').getBoundingClientRect().bottom;
        props.setBlockScrollHeight(scrollHeight);
    }, []);

    const {t} = props;

    const settingComp = useRef();

    const toggleBlockListHandler = e => {
        document.addEventListener('click', handleOutsideClick, false);
        props.toggleMTBBlockList();
    }

    const blockDropdownList = props.blockList;
    const showBlockDropdownList = props.showModelBlockList;
    const caseNumbers = props.caseNumbers;

    const blockShowHideHandler = (status, fieldName) => {
        props.setModelScreenInputs({
            [fieldName + '_block']: status
        })
        props.showHideModelScreenBlocks(fieldName);

        // if uncheck investering block, then reset investering block to default data
        if (fieldName === 'mtb_investering' && status === false) {
            let modelInputs = props.inputs;
            const blockData = props.blockData;
            blockData.map(block => {
                if (block.slug === 'mtb_investering') {
                    const investeringInputs = block.block_inputs;
                    investeringInputs.map(input => {
                        caseNumbers.map(caseNo => {
                            modelInputs[input.slug + '_case' + caseNo] = input.default_data;
                            props.setModelScreenInputs({[input.slug + '_case' + caseNo]: input.default_data})
                        });
                    });
                }
            });

            // finally update calculation result
            props.setModelResult(modelInputs, caseNumbers);
        }

        // if uncheck kvalitet block, then reset kvalitet block to default data
        if (fieldName === 'kn_for_kvalitet' && status === false) {
            let modelInputs = props.inputs;
            const blockData = props.blockData;
            blockData.map(block => {
                if (block.slug === 'kn_for_kvalitet') {
                    const kvalitetInputs = block.block_inputs;
                    kvalitetInputs.map(input => {
                        caseNumbers.map(caseNo => {
                            modelInputs[input.slug + '_case' + caseNo] = input.default_data;
                            props.setModelScreenInputs({[input.slug + '_case' + caseNo]: input.default_data})
                        });
                    });
                }
            });

            // finally update calculation result
            props.setFeedModelResult(modelInputs, caseNumbers);
        }

        // if uncheck Genetics model kvalitet block, then reset kvalitet block to default data
        if (fieldName === 'genetics_kvalitet' && status === false) {
            let modelInputs = props.inputs;
            const blockData = props.blockData;
            blockData.map(block => {
                if (block.slug === 'genetics_kvalitet') {
                    const kvalitetInputs = block.block_inputs;
                    kvalitetInputs.map(input => {
                        caseNumbers.map(caseNo => {
                            modelInputs[input.slug + '_case' + caseNo] = input.default_data;
                            props.setModelScreenInputs({[input.slug + '_case' + caseNo]: input.default_data})
                        });
                    });
                }
            });

            // finally update calculation result
            props.setGeneticsModelResult(modelInputs, caseNumbers);
        }

        // if uncheck Genetics model kvalitet block, then reset kvalitet block to default data
        if (fieldName === 'genetics_tiltak' && status === false) {
            let modelInputs = props.inputs;
            const blockData = props.blockData;
            blockData.map(block => {
                if (block.slug === 'genetics_tiltak') {
                    const tiltakInputs = block.block_inputs;
                    tiltakInputs.map(input => {
                        caseNumbers.map(caseNo => {
                            modelInputs[input.slug + '_case' + caseNo] = input.default_data;
                            props.setModelScreenInputs({[input.slug + '_case' + caseNo]: input.default_data})
                        });
                    });
                }
            });

            // finally update calculation result
            props.setGeneticsModelResult(modelInputs, caseNumbers);
        }

        // if uncheck Opt. model kvalitet block, then reset kvalitet block to default data
        if (fieldName === 'optimalisering_kvalitet' && status === false) {
            let modelInputs = props.inputs;
            const blockData = props.blockData;
            blockData.map(block => {
                if (block.slug === 'optimalisering_kvalitet') {
                    const kvalitetInputs = block.block_inputs;
                    kvalitetInputs.map(input => {
                        caseNumbers.map(caseNo => {
                            modelInputs[input.slug + '_case' + caseNo] = input.default_data;
                            props.setModelScreenInputs({[input.slug + '_case' + caseNo]: input.default_data})
                        });
                    });
                }
            });

            // finally update calculation result
            props.setOptModelResult(modelInputs, caseNumbers);
        }


        // if uncheck Opt. model kvalitet block, then reset kvalitet block to default data
        if (fieldName === 'optimalisering_tiltak' && status === false) {
            let modelInputs = props.inputs;
            const blockData = props.blockData;
            blockData.map(block => {
                if (block.slug === 'optimalisering_tiltak') {
                    const tiltakInputs = block.block_inputs;
                    tiltakInputs.map(input => {
                        caseNumbers.map(caseNo => {
                            modelInputs[input.slug + '_case' + caseNo] = input.default_data;
                            props.setModelScreenInputs({[input.slug + '_case' + caseNo]: input.default_data})
                        });
                    });
                }
            });

            // finally update calculation result
            props.setOptModelResult(modelInputs, caseNumbers);
        }
    }

    const handleOutsideClick = e => {

        if (settingComp === null) {
            return;
        }

        // ignore clicks on the component itself
        if (settingComp.current.contains(e.target)) {
            return;
        }

        if (e.target.className === 'fa fa-angle-down' || e.target.className === 'fa fa-angle-up') {
            return;
        }

        props.hideMTBBlockList();
    }

    return (
        <div id="block_screen_setup" className="section-block model-block-dropdown-panel" ref={settingComp}>
            <div
                className="content-block content-block-dark-blue model-setup-settings"
                onClick={toggleBlockListHandler}>
                <p>{t('settings')}</p>
                {showBlockDropdownList && <i className="fa fa-angle-up"></i>}
                {showBlockDropdownList === false &&
                <i className="fa fa-angle-down"></i>}
            </div>
            {showBlockDropdownList && <ul className="block-list-dropdown">
                {blockDropdownList.map(block => {
                    let disableClass = block.is_default === 1 ? 'input-disable' : '';

                    // blocks to ignore disable class
                    const blockSlugs = [
                        'genetics_kvalitet',
                        'genetics_tiltak',
                        'optimalisering_kvalitet',
                        'optimalisering_tiltak'
                    ];

                    if (blockSlugs.includes(block.slug)) {
                        disableClass = '';
                    }

                    return <li className={disableClass}
                               key={block.id}><CheckBox checkUncheckHandler={blockShowHideHandler}
                                                        fieldValue={props.blockStatus[block.slug + '_show']}
                                                        fieldName={block.slug}
                                                        text={t(block.name)}/></li>
                })}
            </ul>}
        </div>
    );
}

const mapStateToProps = state => ({
    blockList: state.modelScreen.blockList,
    showModelBlockList: state.modelScreen.showModelBlockList,
    blockStatus: state.modelScreen.blockStatus,
    blockData: state.modelScreen.blockData,
    caseNumbers: state.modelScreen.caseNumbers,
    inputs: state.modelScreen.inputs,
})

export default connect(mapStateToProps, {
    toggleMTBBlockList,
    showHideModelScreenBlocks,
    setModelScreenInputs,
    setModelResult,
    setFeedModelResult,
    setOptModelResult,
    hideMTBBlockList,
    setGeneticsModelResult,
    setBlockScrollHeight,
})(withTranslation()(BlockScreenSetup));

