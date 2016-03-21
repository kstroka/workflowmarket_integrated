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

        var controls = {
            topcontrols:Mustache.render(_WMGlobal.templates.topcontrols),
            dataset:Mustache.render(_WMGlobal.templates.dataset),
            bottomcontrols:Mustache.render(_WMGlobal.templates.bottomcontrols)
        };
        var $toolb = $(Mustache.render(_WMGlobal.templates.popuplonganswer,{},controls));
        
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
        var $preview = $(Mustache.render(_WMGlobal.templates.longanswerpreview));

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



 

    _WMGlobal.longAnswer = _la;
}(_WMGlobal))