(function (_WMGlobal) {
    "use strict";

    var _fs = {
        $el :{},
        selectedForm :{},
        transitionID: {}
    };

    _fs.attachEvents = function () {

        //divide to init and attach
        var $icons = _fs.$el.find('.select-icons');

        var $selectName = _fs.$el.find('.select-name');
        var $selectForm = _fs.$el.find('.select-form');

        var $copyForm =  _fs.$el.find('.copy-form');
        var $newForm =  _fs.$el.find('.new-form');

        var $copyFormCancel = _fs.$el.find('.save-form-selection').find('.cancel-save');
        var $copyFormSave = _fs.$el.find('.save-form-selection').find('.confirm-save');
        var $copyFormSelect = _fs.$el.find('.form-selector');
        var $newFormCancel = _fs.$el.find('.save-form-name').find('.cancel-save');;
        var $newFormSave = _fs.$el.find('.save-form-name').find('.confirm-save');;
        var $newFormInput = _fs.$el.find('.form-name');
        var $close = _fs.$el.find('.close-form-selector');

        $copyForm.on('click',function(){
            buildFormSelectionSelectbox($selectForm);
            $icons.hide();
            $selectForm.show();
            $selectForm.addClass('opened');
        });


        $newForm.on('click',function(){
            $icons.hide();
            $selectName.show();
            $selectName.addClass('opened');
            $selectName.find('input').focus();
        });

        $copyFormCancel.on('click',function(){
            $selectForm.hide();
            $selectForm.removeClass('opened');
            $selectName.hide();
            _fs.selectedForm = {};
            $icons.show();
        });

        $copyFormSave.on('click',function(){
            var id = parseInt($copyFormSelect.find(':selected').data('id'));
            if(id === 'undefined' || id === undefined || isNaN(id)){
                //print alert to select
                return;
            }
            _fs.selectedForm = _WMGlobal.getFormById(id);

            $selectForm.hide();
            $selectForm.removeClass('opened');
            $selectName.show();
            $selectName.addClass('opened');
            $selectName.find('input').focus();
        });

        $newFormCancel.on('click',function(){
            if( Object.keys(_fs.selectedForm).length === 0 || _fs.selectedForm === undefined ){
                $selectForm.hide();
                $selectName.hide();
                $selectName.removeClass('opened');
                $icons.show();
            }else{
                $selectName.hide();
                $selectName.removeClass('opened');
                buildFormSelectionSelectbox($selectForm, _fs.selectedForm.name);
                $selectForm.show();
                $selectForm.addClass('opened');
            }

            $newFormInput.val('');
        });

        $newFormSave.on('click',function(){
            var val = $newFormInput.val().trim();

            if(val === '' || val === undefined ){
                $newFormInput.addClass('error');
                return;
            }
            $newFormInput.removeClass('error');
            var form = _WMGlobal.createNewForm(val, _fs.selectedForm.inputs );
            //console.log(form.id);
            _WMGlobal.formMapper.createNewMapping(_fs.transitionID, form.id);
            _WMGlobal.saveData();

            _fs.destroySelector();
            _WMGlobal.formMapper.destroyMapper();
            _WMGlobal.formCreator.init(form);
        });

        _fs.$el.find('.disabled').off('click');

        $close.on('click',function(){
            _fs.destroySelector();
        });

        $(document).on('keydown', function (event) {
            if (event.which == 27) {

                if(_fs.$el.length === undefined){
                    return;
                }

                if($selectForm.hasClass('opened')){
                    $copyFormCancel.trigger('click');
                    return;
                }

                if($selectName.hasClass('opened')){
                    $newFormCancel.trigger('click');
                    return;
                }

                $close.trigger('click');
            }
        });

        $(document).on('keydown', function (event) {
            if (event.which == 13) {

                if(_fs.$el.length === undefined){
                    return;
                }

                if($selectForm.hasClass('opened')){
                    $copyFormSave.trigger('click');
                    return;
                }

                if($selectName.hasClass('opened')){
                    $newFormSave.trigger('click');
                    return;
                }
            }
        });

    };


    _fs.init = function(transitionID){

        if(!$.isEmptyObject(_fs.$el) && _fs.$el.hasClass('opened') ){
            return;
        }

        _fs.transitionID = transitionID;

        _fs.$el = $(formSelectorHTML);
        _WMGlobal.formMapper.$el.addClass('blur');
        _WMGlobal.$el.append(_fs.$el);

        if(_WMGlobal.forms.length === 0){
            _fs.$el.find('.copy-form').addClass('disabled');
        }

        //if(_WMGlobal.getNonEmptyAndMappedForms().length === 0){
        //    _fs.$el.find('.copy-form').addClass('disabled');
        //}

        _fs.attachEvents();
        _fs.$el.fadeIn(150,function(){
            _fs.$el.addClass('opened');
        });
    };

    _fs.destroySelector = function(){
        _WMGlobal.formMapper.$el.removeClass('blur');
        _fs.$el.fadeOut(100,function(){
            _fs.$el.remove();
            _fs.$el = {};
            _fs.transitionID = {};
            _fs.selectedForm = {};
        })
    };


    function buildFormSelectionSelectbox($el,selected){
        var $select = $el.find('.form-selector');
        var nonEmpty = _WMGlobal.forms.getForms();

        $select.empty();
        $select.append($('<option selected value="undefined" data-id = "undefined"> Select from forms </option> ') );

        for(var i in nonEmpty){
            $select.append($('<option value="'+ nonEmpty[i].name +'" data-id = " '+ nonEmpty[i].id +' "> '+ nonEmpty[i].name  +' </option>'));
        }

        if(selected){
            $select.val(selected);
        }
    }

    var formSelectorHTML =
        '<div class="formSelector"> \
            <div class="select-block">\
                <div class="select-icons">\
                    <div class="copy-form">\
                        <div class="copy-form-icon">\
                            <div class="label">Select form</div>\
                        </div>\
                    </div>\
                    <div class="new-form">\
                        <div class="new-form-icon">\
                            <div class="label">Create form</div>\
                        </div>\
                    </div>\
                </div>\
                <div class="select-name">\
                    <div class="label">Insert name</div>\
                    <div class="form-outer-block"><input class="form-name" type="text"></div>\
                    <div class="save-form-name">\
                        <div class="cancel-save">Back</div>\
                        <div class="confirm-save">Create</div>\
                    </div>\
                </div> \
                <div class="select-form">\
                    <div class="label">Select form</div>\
                    <div class="form-outer-block"><select class="form-selector"></select> </div> \
                    <div class="save-form-selection">\
                        <div class="cancel-save">Back</div>\
                        <div class="confirm-save">Select</div>\
                    </div>\
                </div> \
            </div>\
            <div class="close-form-selector">\
            </div>\
        </div>\ ';


    _WMGlobal.formSelector = _fs;


}(_WMGlobal))
