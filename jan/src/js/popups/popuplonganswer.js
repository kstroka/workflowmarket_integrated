(function (_WMGlobal) {
    "use strict";

    var _la = {};

    _la.saveAnswer = function (popup,data){

        var max_length = $(popup).find('input.max-length[type=text]').val();
        data['max-length'] = max_length;
    };

    _la.validateSaving = function($popup,data){
        var valid = true;

        var $fieldname = $popup.find('input.fieldname[type=text]');
        var fielnameVal = $fieldname.val().trim();

        var dataset = $popup.find('.selectbox.dataset');
        var datasetVal = dataset.find(':selected').val();

        if(datasetVal === '' || datasetVal === undefined || datasetVal === 'undefined'){
            dataset.addClass('error');
            dataset.focus();
            valid = false;
        }else{
            dataset.removeClass('error');
        }

        if(fielnameVal === '' || fielnameVal === undefined){
            $fieldname.addClass('error');
            $fieldname.focus();
            valid = false;
        }else{
            $fieldname.removeClass('error');
        }

        return valid;
    };

    _la.buildPopup = function(popup, form){
        buildToolbar(popup,form);
        buildPreview(popup,form);
        attachPreviewEventHanlers(popup);
        _WMGlobal.utilities.attachBasicPreviewHandlers(popup);

    };

    function buildToolbar (popup,data){
        var $toolb = $(longAnswerToolbarHTML);
        _WMGlobal.utilities.attachOnOffHanlder($toolb);
        _WMGlobal.utilities.attachAddToDatasetHandler($toolb,'longanswer');
        _WMGlobal.utilities.popupBuildSelectboxDataset($toolb,'longanswer');

        if(!$.isEmptyObject(data)){
            $toolb.find('input.fieldname[type=text]').val(data['fieldname']);

            if(data['dataset'] !== undefined && data['dataset'] !== ''){
                $toolb.find('.dataset').val(data['dataset']);
            }
            if(data.description !== '' && data.description !== undefined){
                $toolb.find('.description-block').find(".description").val(data['description']);
                _WMGlobal.utilities.setOnOffValue($toolb.find('.description-block').closest('.block').find('.mover'),true);
                $toolb.find('.description-block').css('display','block');
            }

            $toolb.find('input.max-length[type=text]').val(data['max-length']);
            _WMGlobal.utilities.setOnOffValue($toolb.find('.required'),data['required']);
            _WMGlobal.utilities.setOnOffValue($toolb.find('.editable'),data['editable']);
            _WMGlobal.utilities.setOnOffValue($toolb.find('.visible'),data['visible']);

        }
        popup.find('.toolbar-editor').prepend($toolb);
    };

    function buildPreview(popup,data){
        var showPreview = false;
        var $preview = $(longAnswerPreviewHTML);

        if(!$.isEmptyObject(data)) {
            if (data['fieldname'] !== '' && data['fieldname'] !== undefined) {

                $preview.find('.fieldname').text(data['fieldname']);
                showPreview = true;
            }

            if (showPreview) {
                $preview.css('visibility', 'visible');
            }

            $preview.find('.description').text(data['description']);
        }

        popup.find('.preview').prepend($preview);

    };

    function attachPreviewEventHanlers($popup){
        var $preview = $popup.find('.preview');
        var $toolbar = $popup.find('.toolbar-editor');

    }


    var longAnswerPreviewHTML =
        '<div class="preview-block"> \
            <div class="fieldname"></div> \
            <div class="description"></div> \
            <div class="longanswer"> \
                <textarea  class="longanswer-input" type="text"></textarea> \
            </div> \
            <div class="preview-save"> \
                <div class="preview-back-button">BACK</div> \
             <div class="preview-next-button">NEXT</div> \
             </div> \
        </div> ';


    var longAnswerToolbarHTML =
        '<div class="inputfield-name"> \
            <div class="inputfield-icon"> \
            </div> \
            <div class= "inputfield-name-inner">Long answer</div> \
        </div> \
        <div class="inputfield-setting"> \
            <div class="block"> \
                <div class="heading">Question</div> \
                <div class="block-body"> \
                    <input type="text" class="small-input fieldname"> \
                </div> \
            </div> \
            <div class="block"> \
                <div class="block-body"> \
                    <div class="label">Description \
                        <div class="description"> \
                        </div> \
                    </div> \
                    <div class="on-off-setup"> \
                        <div class="mover off-selected"> \
                            <div class="on-setup">On</div> \
                            <div class="slider"></div> \
                            <div class="off-setup">Off</div> \
                        </div> \
                    </div> \
                    <div class="description-block"> \
                        <textarea type="text" class="large-input description"></textarea> \
                    </div> \
                </div> \
            </div> \
            <div class="block"> \
                <div class="heading">Max length \
                    <div class="description"> \
                    </div> \
                </div> \
                <div class="block-body"> \
                    <input type="text" class="max-length"> \
                </div> \
            </div> \
            <div class="block"> \
                <div class="heading">Dataset variable\
                    <div class="description"> \
                    </div> \
                </div> \
                <div class="block-body"> \
                    <select class="selectbox dataset"> \
                    </select> \
                    <div class="dataset-add-icon"></div>\
                    <div class="add-dataset-block"> \
                        <div class="label"> Set dataset name</div> \
                        <input type="text" class="small-input new-dataset"> \
                        <div class="dataset-save"> \
                            <div class="dataset-save-button">Save</div> \
                            <div class="dataset-cancel-button">Cancel</div> \
                        </div> \
                    </div> \
                </div> \
            </div> \
            <div class="block"> \
                <div class="block-body"> \
                    <div class="label">Required \
                        <div class="description"> \
                        </div> \
                    </div> \
                    <div class="on-off-setup"> \
                        <div class="mover required on-selected"> \
                            <div class="on-setup">On</div> \
                            <div class="slider"></div> \
                            <div class="off-setup">Off</div> \
                        </div> \
                    </div> \
                </div> \
            </div> \
            <div class="block"> \
                <div class="block-body"> \
                    <div class="label">Editable \
                        <div class="description"> \
                        </div> \
                    </div> \
                    <div class="on-off-setup"> \
                        <div class="mover editable on-selected"> \
                            <div class="on-setup">On</div> \
                            <div class="slider"></div> \
                            <div class="off-setup">Off</div> \
                        </div> \
                    </div> \
                </div> \
            </div> \
            <div class="block"> \
                <div class="block-body"> \
                    <div class="label">Visible \
                        <div class="description"> \
                        </div> \
                    </div> \
                    <div class="on-off-setup"> \
                        <div class="mover visible on-selected"> \
                            <div class="on-setup">On</div> \
                            <div class="slider"></div> \
                            <div class="off-setup">Off</div> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        </div>';

    _WMGlobal.longAnswer = _la;
}(_WMGlobal))