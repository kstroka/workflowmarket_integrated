(function (_WMGlobal) {
    "use strict";
    //zmenit nastavenie novych id

    var _fcm = {
        $el : {},
        popup : {},
        main : {},
        openedInputfieldToEdit:{},
        form : {},
        oldFormName : {}
    };

    _fcm.attachEvents = function () {
        var $formName = _fcm.main.find('.form-name');
        var $formNameInput = _fcm.main.find('.form-name-value');

        $(document).off('click');


        $('.inputfields-group').sortable({
            placeholder :'inputfield-placeholder',
            cancel: '.newinputfield',

            over: function(event, ui){
                if($('.inputfields-group').hasClass('inputfield-group-border')){
                    $('.inputfields-group').removeClass('inputfield-group-border');
                }
            },
            out: function(event,ui){
                if(_fcm.form.inputs.length === 0){
                    $('.inputfields-group').addClass('inputfield-group-border');
                }
            },
            receive:function(event,ui){
                if( (ui.item.hasClass('button-small') ||ui.item.hasClass('button-medium') || ui.item.hasClass('button-large'))){
                    var type = ui.item.data().type;
                    var listed = $('.buttons-group').find('[data-type="'+type+'"]');
                    var dropped = $('.inputfields-group').find('.button-small, .button-medium, .button-large');
                    var order = dropped.index();
                    dropped.remove();
                    listed.trigger('click',[{order:order}]);
                }
            },
            stop : function(event, ui) {
                _fcm.setProperOrders(_fcm.main, _fcm.form);
                if(_fcm.form.inputs.length === 0){
                    $('.inputfields-group').addClass('inputfield-group-border');
                }
            }
        }).disableSelection();



        $(".buttons-group").children().draggable({
            helper : 'clone',
            appendTo: 'body',
            connectToSortable: 'ul.inputfields-group',
            zIndex: 20,
            start: function( event, ui ) {
                $(this).addClass('dragged');
            },
            stop: function( event, ui ) {
                $(this).removeClass('dragged');
            },
            containment: $('document')
        });



        $(".buttons-group").children().on('click', function (event,data) {
            var type = $(event.target).data().type;
            if(data  && data.order !== undefined){
                _fcm.openedInputfieldToEdit = _fcm.addInputfield(_WMGlobal.getInputID(), type,data.order);
            }else{
                _fcm.openedInputfieldToEdit = _fcm.addInputfield(_WMGlobal.getInputID(), type);
            }

            $('.inputfields-group').removeClass('inputfield-group-border');
            _fcm.buildPopup();
        });

        $(".inputfield-save-button").on('click', function (event) {
            //if not valid
            if(!_fcm.validateInputfield(_fcm.openedInputfieldToEdit)){
                return;
            }
            _fcm.saveInputfield(_fcm.openedInputfieldToEdit);
            _fcm.openedInputfieldToEdit = {};
            closePopup(_fcm);
        });

        //finish button
        _fcm.main.find(".close-button").on('click', function (event) {

            _fcm.saveFormsData();
            _WMGlobal.formMapper.init();
            _fcm.destroyFormCreator();
        });


        _fcm.main.find(".cancel-button").on('click', function (event) {
            _WMGlobal.formMapper.init();
            _fcm.destroyFormCreator();
        });


        _fcm.popup.find(".preview").find(".close").add('.inputfield-cancel-button').on('click',function(){
            popupCancel(_fcm,_fcm.openedInputfieldToEdit);
            _fcm.openedInputfieldToEdit = {};
            closePopup(_fcm);
        });


        //validate form name
        $formNameInput.on('input',function(event){
            var val = $(event.target).val().trim();
            if(val === '' || val === undefined){
                $formName.addClass('error');
                return;
            }
            $formName.removeClass('error');
            _fcm.form.name = val;
        });

        $formNameInput.on('focus',function(event){
            var val = $(event.target).val().trim();
            _fcm.oldFormName = val;

            if(val === '' || val === undefined){
                $formName.addClass('error');
                return;
            }
            $formName.removeClass('error');

            _fcm.form.name = val;
        });

        $formNameInput.on('focusout',function(event){
            var val = $(event.target).val().trim();

            if(val === '' || val === undefined){
                $(event.target).val(_fcm.oldFormName);
            }
            $formName.removeClass('error');

            _fcm.form.name = val;
        });



        //key triggers
        $(document).off('keydown').on('keydown',function(event){
            //editing inputfield
            if(_fcm.popup.hasClass('opened')){
                if (event.which === 27){
                    popupCancel(_fcm,_fcm.openedInputfieldToEdit);
                    _fcm.openedInputfieldToEdit = {};
                    closePopup(_fcm);
                }

                if (event.which === 13) {
                    _fcm.saveInputfield(_fcm.openedInputfieldToEdit);
                    _fcm.openedInputfieldToEdit = {};
                    closePopup(_fcm);
                }
            }
            //not editing inputfield
            if(!_fcm.popup.hasClass('opened')) {
                if (event.which === 27) {

                    if($formNameInput.is(":focus")){

                        if($formNameInput.val() === ''){
                            $formNameInput.val(_fcm.oldFormName);
                        }
                        $formNameInput.blur();
                        return;
                    }

                    if(_WMGlobal.formMapper.$el.length !== undefined){
                        return;
                    }
                    _fcm.main.find(".close-button").trigger('click');
                }
            }
        });

    };

    _fcm.init = function(form){
        _fcm.buildFormCreator();
        _fcm.loadFormsData(form);
        _fcm.attachEvents();
    };

    _fcm.addInputfield = function( id,type,order,fieldname,description, required, visible, editable ,dataset, isDone){
        var newInputField = new Inputfield( id,type,fieldname,description, required, visible, editable ,dataset, order, isDone);


        if(order !== undefined && order <_fcm.form.inputs.length ){
            var insertBefore = $('.inputfields-group').children().eq(order);
            newInputField.$el.insertBefore(insertBefore);
        }else{

            // newInputField.$el.insertBefore('.newinputfield');
            $('.inputfields-group').append(newInputField.$el);
        }

        _fcm.form.inputs.push(newInputField);

        newInputField.$el.addClass('new');

        _fcm.setProperOrders(_fcm.main,_fcm.form);

        attachInputfieldHandler(newInputField);

        return newInputField;

    };

    _fcm.removeInputfield = function (index){
        if(index === undefined){
            return;
        }

        _fcm.form.inputs[index].$el.hide(200,function(){
            _fcm.form.inputs[index].$el.remove();
            _fcm.form.inputs.splice(index, 1);
            _fcm.setProperOrders(_fcm.main,_fcm.form);
            //_fcm.saveFormsData();

            if(_fcm.form.inputs.length === 0){
                $('.inputfields-group').addClass('inputfield-group-border');
            }
        });




    };

    _fcm.buildPopup = function(){

        clearPopup(this);
        clearPreview(this);
        switch(_fcm.openedInputfieldToEdit.type) {
            case 'shortanswer':
                _WMGlobal.shortAnswer.buildPopup(_fcm.popup,_fcm.openedInputfieldToEdit);
                break;
            case 'longanswer':
                _WMGlobal.longAnswer.buildPopup(_fcm.popup,_fcm.openedInputfieldToEdit);
                break;
            case 'selectbox':
                _WMGlobal.selectboxAnswer.buildPopup(_fcm.popup,_fcm.openedInputfieldToEdit);
                break;
            case 'checkbox':
                _WMGlobal.checkbox.buildPopup(_fcm.popup,_fcm.openedInputfieldToEdit);
                break;
            default:
                _WMGlobal.shortAnswer.buildPopup(_fcm.popup,_fcm.openedInputfieldToEdit);
        }

        openPopup(this);
    };

    //save decide what object save to storage
    _fcm.saveInputfield = function(inputfieldObj){
        var type = inputfieldObj.type;

        _fcm.saveBasicData(_fcm.popup,inputfieldObj);

        switch(type) {
            case 'shortanswer':
                _WMGlobal.shortAnswer.saveAnswer(_fcm.popup,inputfieldObj);
                break;
            case 'longanswer':
                _WMGlobal.longAnswer.saveAnswer(_fcm.popup,inputfieldObj);
                break;
            case 'selectbox':
                _WMGlobal.selectboxAnswer.saveAnswer(_fcm.popup,inputfieldObj);
                break;
            case 'checkbox':
                _WMGlobal.checkbox.saveAnswer(_fcm.popup,inputfieldObj);
                break;
            default:
                _WMGlobal.shortAnswer.saveAnswer(_fcm.popup,inputfieldObj);

        }

        _fcm.updateInputfieldAfterSave(_fcm.popup,inputfieldObj);
        //_fcm.saveFormsData();
    };

    _fcm.validateInputfield = function(inputfieldObj){
        var type = inputfieldObj.type;
        //how to handle validation .when to remove outline. min max chars ..error messages
        switch(type) {
            case 'shortanswer':
                return _WMGlobal.shortAnswer.validateSaving(_fcm.popup,inputfieldObj);

            case 'longanswer':
               return _WMGlobal.longAnswer.validateSaving(_fcm.popup,inputfieldObj);

            case 'selectbox':
                return _WMGlobal.selectboxAnswer.validateSaving(_fcm.popup,inputfieldObj);

            case 'checkbox':
                return _WMGlobal.checkbox.validateSaving(_fcm.popup,inputfieldObj);

            default:
                return _WMGlobal.shortAnswer.validateSaving(_fcm.popup,inputfieldObj);
        }
    };

    _fcm.saveFormsData = function(){

        for(var i in _WMGlobal.forms){
            if(_WMGlobal.forms[i].id === _fcm.form.id){
                _WMGlobal.forms[i].inputs = _fcm.form.inputs;
            }
        }

        _WMGlobal.saveData();
    };

    _fcm.loadFormsData = function(form) {
        var data;

        _fcm.form = jQuery.extend(true, {}, form);
        _fcm.main.find('.form-name-value').val(_fcm.form.name);

        if(_fcm.form.inputs.length === 0){
            $('.inputfields-group').addClass('inputfield-group-border');
            return;
        }

        sortByOrder(_fcm.form.inputs);

        for (var i = 0; i < _fcm.form.inputs.length; i++) {
            data = _fcm.form.inputs[i];
            _fcm.form.inputs[i].$el = $(InputfieldElement(data.id, data.type, data.fieldname));
            attachInputfieldHandler(_fcm.form.inputs[i]);
            _fcm.main.find('.inputfields-group').append( _fcm.form.inputs[i].$el);
        }

    };

    _fcm.buildFormCreator = function (){
        _fcm.$el = $(formCreatorHTML);

        _fcm.popup = _fcm.$el.find(".popup");
        _fcm.main = _fcm.$el.find(".main");

        _WMGlobal.$el.append(_fcm.$el);
        _fcm.$el.fadeIn(300);
    };

    _fcm.destroyFormCreator = function(){

        _fcm.$el.fadeOut(100,function(){
            _fcm.$el.remove();
            _fcm.openedInputfieldToEdit = {};
            _fcm.form = {};
            _fcm.openedInputfieldToEdit = {};
        });
    };

    _fcm.clearForm = function(){

        for(var i in _fcm.form.inputs ){
            _fcm.form.inputs[i].$el.remove();
        }

        _fcm.form.inputs = [];

        for(var i in _WMGlobal.forms){
            if(_WMGlobal.forms[i].id === _fcm.form.id){
                _WMGlobal.forms[i].inputs = _fcm.form.inputs;
            }
        }

    };

    _fcm.isEmptyForm = function(){
       return _fcm.form.inputs.length === 0;
    };



    _fcm.saveBasicData = function($popup, data){
        var fieldname = $popup.find('input.fieldname[type=text]').val().trim();
        var description = $popup.find('.description-block').find(".description").val().trim();
        var dataset = $popup.find('.dataset').val();
        var required = _WMGlobal.utilities.getOnOffValue($popup.find('.required'));
        var editable = _WMGlobal.utilities.getOnOffValue($popup.find('.editable'));
        var visible = _WMGlobal.utilities.getOnOffValue($popup.find('.visible'));

        data['fieldname'] = fieldname;
        data['description'] = description;
        data['dataset'] = dataset;
        data['required'] = required;
        data['editable'] = editable;
        data['visible'] = visible;
    };

    _fcm.updateInputfieldAfterSave = function($popup, data){
        data.$el.removeClass('new');
        data.$el.find('.input-fieldname').text(data['fieldname']);
    };


    _fcm.setProperOrders = function ($main,form){

        var $inputfields = $main.find('.inputfields-group').find('li.inputfield');

        $inputfields.each(function(i){
            var index = getIndexOfElement($(this),form);
            var input = _fcm.form.inputs[index];
            input.order = i;
        });

        sortByOrder(_fcm.form.inputs);

    };

    function sortByOrder(array){
        array.sort(function(a,b){
            if (a.order < b.order)
                return -1;
            else if (a.order == b.order)
                return 0;
            else
                return 1;
        });
    }


    //clear popup toolbar and preview
    function clearPopup(module){
        module.popup.find('.inputfield-name').remove();
        module.popup.find('.inputfield-setting').remove();
    }

    function clearPreview(module){
        module.popup.find('.preview-block').remove();
    }

    //open popup
    function openPopup(module){
        module.main.addClass("blur");
        module.popup.addClass('opened');
        module.popup.fadeIn(200);
        $(".toolbar-editor input:text,.toolbar-editor textarea").first().focus();
    }

    function closePopup(module){
        module.main.removeClass("blur");
        module.popup.removeClass('opened');
        module.popup.fadeOut(100);
    }

    //find index of element in array
    function getIndexOfElement($el,form){

        var id = $el.data().id;
        //var id = $el.attr('data-id');
        for( var i = 0; i< form.inputs.length; i++){
            if(form.inputs[i].id == id){
                return i;
            }
        }
        return -1;
    }


    //constructor
    function Inputfield(id,type,order,fieldname,description, required, visible, editable ,dataset, isDone){

        if(id === undefined){
            id = 0;
        }

        if(type === undefined){
            type = 'shortanswer';
        }

        if(fieldname === undefined){
            fieldname = '';
        }

        if(description === undefined){
            description = '';
        }

        if(required === undefined){
            required = true;
        }

        if(visible === undefined){
            visible = true;
        }

        if(editable === undefined){
            editable = true;
        }


        if(dataset === undefined){
            dataset = '';
        }

        if(order === undefined){
            order = 9999;
        }

        if(isDone === undefined){
            isDone = false;
        }

        var $el = $(InputfieldElement(id,type,fieldname));


        var inputData = {
            id : id,
            type : type,
            fieldname : fieldname,
            description : description,
            required : required,
            visible : visible,
            editable : editable,
            dataset : dataset,
            order : order,
            isDone : isDone,
            $el : $el
        };


        return inputData;

    }

    //element constructor
    function InputfieldElement(id,type,fieldname){
        var inputfield = '<li class="inputfield" draggable="true" data-id ="' + id + '">'+
            '<div class="input-icon"><div class="icon-'+ type  +'"></div></div>'+
            '<span class="input-fieldname">'+ fieldname +'</span>'+
            '<div class="input-remove-icon"><div class="icon-close"></div></div></li>';

        return inputfield;
    }

    //popup dont save inputfield
    function popupCancel(module,inputfieldObject){
        if(inputfieldObject.$el.hasClass("new")){
            var index = getIndexOfElement(inputfieldObject.$el,_fcm.form);
            _fcm.removeInputfield(index);

        }
    }



    function attachInputfieldHandler(inputfield){
        inputfield.$el.find('.input-remove-icon').on('click',function(event){
            event.stopPropagation();
            var index = getIndexOfElement($(event.target).closest('.inputfield'),_fcm.form);
            _fcm.removeInputfield(index);
        });

        inputfield.$el.on('click',function(event){
            var index = getIndexOfElement($(event.target).closest('.inputfield'),_fcm.form);
            _fcm.openedInputfieldToEdit =_fcm.form.inputs[index];
            _fcm.buildPopup(_WMGlobal.openedInputfieldToEdit);
        });
    }
    var formCreatorHTML =
        '<div class= "formCreator"> \
            <div class="main"> \
                <div class="form-name">\
                        <div class="form-icon"><div class="icon-check"></div></div>\
                        <input class="form-name-value" type="text">\
                    </div>\
                <div class="toolbar "> \
                    <div class="content"> \
                        <ul class="buttons-group"> \
                            <li class="button-medium" draggable="true" data-type="shortanswer"> <div class="button-icon"><div class="icon-shortanswer"></div></div> Short answer </li> \
                            <li class="button-medium" draggable="true" data-type="longanswer"> <div class="button-icon"><div class="icon-longanswer"></div></div> Long answer </li> \
                            <li class="button-medium" draggable="true" data-type="selectbox"> <div class="button-icon"><div class="icon-selectbox"></div></div> Selectbox </li> \
                            <li class="button-medium" draggable="true" data-type="checkbox"> <div class="button-icon"><div class="icon-checkbox"></div></div> Checkbox </li> \
                        </ul> \
                        <div class="cancel-save">\
                                <div class="cancel-button">Cancel</div>\
                        </div> \
                        <div class="close-form-creator">\
                            <div class="close-button">Finish</div>\
                        </div>\
                    </div> \
                </div> \
                <div class="window "> \
                    <div class="content"> \
                         <ul class="inputfields-group"> \
                        </ul> \
                        <ul class="newinputfield-group">\
                           <li class="newinputfield" draggable="true"> <div class="input-icon"><div class="icon-add"></div></div> \
                                 <span class="input-text">Add next field by click or use Drag & Drop</span> \
                            </li> \
                        </ul>\
                    </div> \
                </div> \
            </div> \
             <div class="popup"> \
                <div class="toolbar-editor"> \
                    <div class="inputfield-save"> \
                        <div class="inputfield-save-button">Save</div> \
                         <div class="inputfield-cancel-button">Cancel</div> \
                    </div> \
                </div> \
                <div class="preview"> \
                    <div class="close"> \
                        <div class="icon-close"></div> \
                    </div> \
                </div> \
            </div>\
        </div>';




    _WMGlobal.formCreator = _fcm;
    //add name
    //selector design
    //show name on hover

}(_WMGlobal))