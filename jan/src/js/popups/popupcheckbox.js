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
        var $toolb = $(Mustache.render(_WMGlobal.templates.popupcheckbox));

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
        var $preview = $(Mustache.render(_WMGlobal.templates.checkboxpreview));

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
            var Choice = new _WMGlobal.checkboxChoice(val,i);

            if($.inArray(val,oldselected) !== -1){
                Choice.setCheckboxValue(true);
            }
            checkbox.append(Choice.$el);
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
    




    _WMGlobal.checkbox = _cb;
}(_WMGlobal))