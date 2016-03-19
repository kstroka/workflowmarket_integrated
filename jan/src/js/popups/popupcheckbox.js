/**
 * Created by janpolacek on 301215.
 */
(function (_WMGlobal) {
    "use strict";

    var _cb = {};

    _cb.saveAnswer = function (popup,data){

        var alphorder = _WMGlobal.utilities.getOnOffValue($(popup).find('.alph-order'));
        var choices = _WMGlobal.utilities.getChoices($(popup));
        var minimumVal = $(popup).find('input.min-selected[type=text]').val().trim();
        var maximumVal = $(popup).find('input.max-selected[type=text]').val().trim();

        data['alph-order'] = alphorder;
        data['choices'] = choices;
        data['minVal'] = minimumVal;
        data['maxVal'] = maximumVal;
    };

    _cb.validateSaving = function($popup,data){

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

    _cb.buildPopup = function(popup, data){
        buildToolbar(popup,data);
        buildPreview(popup,data);
        attachPreviewEventHanlers(popup,data);
        _WMGlobal.utilities.attachBasicPreviewHandlers(popup);
    };

    function buildToolbar (popup,data){
        var $toolb = $(checkboxToolbarHTML);
        _WMGlobal.utilities.attachAddChoiceHandler($toolb);
        _WMGlobal.utilities.attachChangeChoiceHandler($toolb.find('.choice-block'),$toolb);
        _WMGlobal.utilities.attachOnOffHanlder($toolb);
        _WMGlobal.utilities.attachAddToDatasetHandler($toolb,'checkbox');
        _WMGlobal.utilities.popupBuildSelectboxDataset($toolb,'checkbox');

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

    function buildPreview($popup,data){
        var showPreview = false;
        var $preview = $(checkboxAnswerPreviewHTML);

        if(!$.isEmptyObject(data)){
            if(data['fieldname'] !== ''  &&  data['fieldname'] !== undefined){

                $preview.find('.fieldname').text(data['fieldname']);
                showPreview = true;
            }

            //if(data['choices'] === undefined || data['choices'].length === 0){
            //    showPreview = false;
            //}

            $preview.find('.description').text(data['description']);

            updatePreviewCheckbox($popup.find('.toolbar-editor'),$preview,data['choices'],data['alph-order']);
        }

        if(showPreview){
            $preview.css('visibility','visible');

        }
        $popup.find('.preview').prepend($preview);

    }

    function attachPreviewEventHanlers($popup,data){
        var $preview = $popup.find('.preview');
        var $toolbar = $popup.find('.toolbar-editor');

        $toolbar.find('.alph-order').on('click',function(){
            updatePreviewCheckbox($toolbar,$preview);
        });

        $toolbar.find('.choices').on('choice:removed choice:added choice:changed',function(){
            updatePreviewCheckbox($toolbar,$preview);
        });

    }
    
    function updatePreviewCheckbox($toolbar,$preview,choices,alphorder){
        var alphorder = alphorder || _WMGlobal.utilities.getOnOffValue($toolbar.find('.alph-order'));
        var choices = choices || _WMGlobal.utilities.getChoices($toolbar);
        var checkbox = $preview.find('.checkbox');
        var oldselected = getCheckedList(checkbox);

        checkbox.empty();

        if(alphorder === true){
            choices.sort();
        }

        for(var i in choices) {
            var val = choices[i];
            var $newchoice = $('<div class="checkbox-input-block"></di><input type="checkbox" value="'+val+'" class="checkbox-input" id="checkbox'+i+'">' +
                '<label class="label" for="checkbox'+i+'"><div class="check-icon"><div class="icon-check"></div></div>'+val+'</label><div>');

            attachCheckboxHandler($newchoice);

            if($.inArray(val,oldselected) !== -1){
                setCheckboxValue($newchoice,true);
            }
            checkbox.append($newchoice);
        }    
    }
    
    function attachCheckboxHandler($checkbox){
        $checkbox.off('click').on('click',function(event){
            event.stopPropagation();
            event.preventDefault();
            var $checkboxVal = $(event.target).closest('.checkbox-input-block');
            switchCheckbox($checkboxVal);
        });
    }

    function setCheckboxValue($el,value){
        var $label = $el.find('.label');
        var $input = $el.find('.checkbox-input');

        if(value === true) {
            if(!$label.hasClass('checked')){
                $label.addClass('checked');
            }
            $input.prop('checked', true);
        }else{
            if($label.hasClass('checked')){
                $label.removeClass('checked');
            }
            $input.prop('checked', false);
        }
    }

    function getCheckedList($checkbox){
        var list = [];
        $checkbox.find('.checkbox-input-block').each(function(){
            var $input = $(this).find('.checkbox-input');
            if($input.is(':checked')){
                list.push($input.val());
            }
        });
        return list;
    }
    
    function switchCheckbox($checkbox){

        var $label = $checkbox.find('.label');
        var $input = $checkbox.find('.checkbox-input');

        if($label.hasClass('checked')){
            $label.removeClass('checked');
            $input.prop('checked', false);
        }else{
            $label.addClass('checked');
            $input.prop('checked', true);
        }
    }



    var checkboxAnswerPreviewHTML =
        '<div class="preview-block"> \
            <div class="fieldname"></div> \
            <div class="description"></div> \
            <div class="checkbox"> \
            </div> \
            <div class="preview-save"> \
                <div class="preview-back-button">BACK</div> \
             <div class="preview-next-button">NEXT</div> \
             </div> \
        </div> ';


    var checkboxToolbarHTML =
        '<div class="inputfield-name"> \
    <div class="inputfield-icon"> \
        <div class="icon-checkbox"></div> \
    </div> \
    <div class= "inputfield-name-inner">Checkbox</div> \
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
                    <div class="icon-description"></div> \
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
                <div class="icon-description"></div> \
            </div> \
        </div> \
        <div class="block-body"> \
            <div class="choices"> \
                <div class="choice-block"> \
                    <input type="text" class="choice"> \
                        <div class="controls"> \
                            <div class="add-choice-icon">\
                                <div class="icon-add"></div> \
                            </div> \
                    </div>\
                </div> \
            </div> \
        </div> \
    </div> \
    <div class="block"> \
        <div class="heading">Selection count \
            <div class="description"> \
                <div class="icon-description"></div> \
            </div> \
        </div> \
        <div class="block-body"> \
            <div class="selection-count">\
                <div class="min-selection">\
                    <div class="label">Minimum</div>\
                    <input type="text" class="min-selected"> \
                </div> \
                <div class="max-selection">\
                    <div class="label">Maximum</div>\
                    <input type="text" class="max-selected"> \
                </div> \
            </div> \
        </div> \
    </div> \
    \
    <div class="block"> \
        <div class="block-body"> \
            <div class="label">Alphabetical order \
                <div class="description"> \
                    <div class="icon-description"></div> \
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
                <div class="icon-description"></div> \
            </div> \
        </div> \
        <div class="block-body"> \
            <select class="selectbox dataset"> \
            </select> \
            <div class="dataset-add-icon"><div class="icon-add"></div></div>\
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
                    <div class="icon-description"></div> \
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
                    <div class="icon-description"></div> \
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
                    <div class="icon-description"></div> \
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

    _WMGlobal.checkbox = _cb;
}(_WMGlobal))