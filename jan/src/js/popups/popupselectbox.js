/**
 * Created by janpolacek on 301215.
 */
(function (_WMGlobal) {
    "use strict";

    var _sb = {};

    _sb.saveAnswer = function (popup,data){

        var alphorder = _WMGlobal.utilities.getOnOffValue($(popup).find('.alph-order'));
        var choices = _WMGlobal.utilities.getChoices($(popup));

        data['alph-order'] = alphorder;
        data['choices'] = choices;
    };

    _sb.validateSaving = function($popup,data){
        var valid = true;

        var choices = _WMGlobal.utilities.getChoices($popup);
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

        if(choices.length === 0 ){
            _WMGlobal.utilities.noChoiceHanlder($popup,true);
            valid = false;
        }else{
            _WMGlobal.utilities.noChoiceHanlder($popup,false);
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

    _sb.buildPopup = function(popup, data){
        buildToolbar(popup,data);
        buildPreview(popup,data);
        attachPreviewEventHanlers(popup,data);
        _WMGlobal.utilities.attachBasicPreviewHandlers(popup);

    };

    function buildToolbar (popup,data){
        var $toolb = $(selectboxToolbarHTML);
        _WMGlobal.utilities.attachAddChoiceHandler($toolb);
        _WMGlobal.utilities.attachChangeChoiceHandler($toolb.find('.choice-block'),$toolb);
        _WMGlobal.utilities.attachOnOffHanlder($toolb);
        _WMGlobal.utilities.attachAddToDatasetHandler($toolb,'selectbox');
        _WMGlobal.utilities.popupBuildSelectboxDataset($toolb,'selectbox');

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

            _WMGlobal.utilities.loadChoices($toolb,data['choices']);
            _WMGlobal.utilities.setOnOffValue($toolb.find('.alph-order'),data['alph-order']);
            _WMGlobal.utilities.setOnOffValue($toolb.find('.required'),data['required']);
            _WMGlobal.utilities.setOnOffValue($toolb.find('.editable'),data['editable']);
            _WMGlobal.utilities.setOnOffValue($toolb.find('.visible'),data['visible']);

        }
        popup.find('.toolbar-editor').prepend($toolb);
    };

    function buildPreview(popup,data){
        var showPreview = false;
        var $preview = $(selectboxAnswerPreviewHTML);
        var selectbox = $preview.find('.selectbox-input');


        if(!$.isEmptyObject(data)){
            if (data['fieldname'] !== '' && data['fieldname'] !== undefined) {

                $preview.find('.fieldname').text(data['fieldname']);
                showPreview = true;
            }

            $preview.find('.description').text(data['description']);

            selectbox.empty();

            selectbox.append($('<option selected value="undefined"></option>'));

            //
            //if(data['choices'] === undefined || data['choices'].length === 0){
            //    showPreview = false;
            //}

            if(data['alph-order'] === true){
                data['choices'].sort();
            }

            for(var i in data['choices']) {
                var val = data['choices'][i];
                var $newOpt =   $('<option value="'+val+'">'+val+'</option>');
                selectbox.append($newOpt);
            }

        }

        if (showPreview) {
            $preview.css('visibility', 'visible');
        }
        popup.find('.preview').prepend($preview);

    }

    function attachPreviewEventHanlers($popup,data){
        var $preview = $popup.find('.preview');
        var $toolbar = $popup.find('.toolbar-editor');

        $toolbar.find('.alph-order').on('click',function(){

            var alphorder = _WMGlobal.utilities.getOnOffValue($toolbar.find('.alph-order'));
            var choices = _WMGlobal.utilities.getChoices($toolbar);
            var selectbox = $preview.find('.selectbox-input');
            var oldV = selectbox.val();

            selectbox.empty();

            selectbox.append($('<option selected value="undefined"></option>'));

            if(alphorder === true){
                choices.sort();
            }

            for(var i in choices) {
                var val = choices[i];
                var $newOpt =   $('<option value="'+val+'">'+val+'</option>');
                selectbox.append($newOpt);
            }

            selectbox.val(oldV);
        });

        $toolbar.find('.choices').on('choice:removed choice:added choice:changed',function(){


            var alphorder = _WMGlobal.utilities.getOnOffValue($toolbar.find('.alph-order'));
            var choices = _WMGlobal.utilities.getChoices($toolbar);
            var selectbox = $preview.find('.selectbox-input');
            var oldV = selectbox.val();

            selectbox.empty();

            selectbox.append($('<option selected value="undefined"></option>'));

            if(alphorder === true){
                choices.sort();
            }

            for(var i in choices) {
                var val = choices[i];
                var $newOpt =   $('<option value="'+val+'">'+val+'</option>');
                selectbox.append($newOpt);
            }
            selectbox.val(oldV);
        });



    }



    var selectboxAnswerPreviewHTML =
        '<div class="preview-block"> \
            <div class="fieldname"></div> \
            <div class="description"></div> \
            <div class="selectbox"> \
                <select class="selectbox-input"></select>\
            </div> \
            <div class="preview-save"> \
                <div class="preview-back-button">BACK</div> \
             <div class="preview-next-button">NEXT</div> \
             </div> \
        </div> ';


    var selectboxToolbarHTML =
        '<div class="inputfield-name"> \
    <div class="inputfield-icon"> \
    </div> \
    <div class= "inputfield-name-inner">Selectbox</div> \
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
        <div class="heading">Add choices \
            <div class="description"> \
            </div> \
        </div> \
        <div class="block-body"> \
            <div class="choices"> \
                <div class="choice-block"> \
                    <input type="text" class="choice"> \
                        <div class="controls"> \
                            <div class="add-choice-icon">\
                            </div> \
                    </div>\
                </div> \
            </div> \
        </div> \
    </div> \
    <div class="block"> \
        <div class="block-body"> \
            <div class="label">Alphabetical order \
                <div class="description"> \
                </div> \
            </div> \
            <div class="on-off-setup"> \
                <div class="mover alph-order on-selected"> \
                    <div class="on-setup">On</div> \
                    <div class="slider"></div> \
                    <div class="off-setup">Off</div> \
                </div> \
            </div> \
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

    _WMGlobal.selectboxAnswer = _sb;
}(_WMGlobal))