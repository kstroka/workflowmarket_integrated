"use strict";

var _WMGlobal = {};
var MAX_FORM_ID = 0;
var MAX_INPUT_ID = 0;

_WMGlobal.forms = [];
_WMGlobal.$el = $(".app");

_WMGlobal.loadData = function(){

    this.dataset.loadFromLocalStorage();
    this.mapping.loadFromLocalStorage();
    this.forms.loadFromLocalStorage();

    loadVariables();
};

_WMGlobal.saveData = function(){
    this.dataset.saveToLocalStorage();
    this.mapping.saveToLocalStorage();
    this.forms.saveToLocalStorage();

    saveVariables();
};

_WMGlobal.init = function(){
    this.loadData();
    this.formMapper.init();
};

_WMGlobal.sendFormsJSON = function(){
    var toSend = {
        idCase:1,
        forms: this.forms.getForms(),
        dataset : this.dataset.getDataset(),
        mapping : this.mapping.getMapping()
    };

    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([JSON.stringify(toSend)], {type: 'text/txt'}));
    a.download = 'json.txt';
    document.body.appendChild(a);
    //a.click();

    document.body.removeChild(a)
};

_WMGlobal.getFormID = function(){
    return MAX_FORM_ID++;
};

_WMGlobal.getInputID = function(){
    return MAX_INPUT_ID++;
};

_WMGlobal.getFormById = function(id){
    return this.forms.getForm(id);
};

_WMGlobal.removeFormByID = function(id){
    return this.forms.removeForm(id);
};

_WMGlobal.getMappedForms = function(){
    var mapped = this.mapping.getMappedForms();
    return this.forms.getFormsByList(mapped)
};

_WMGlobal.createNewForm = function(name,inputs){
   return this.forms.addForm(name,inputs);
};

_WMGlobal.addToDataset = function(type,key,value){
    return this.dataset.addKey(type,key,value) === -1 ? false : true;
};

_WMGlobal.getDatasetTypeList = function (type){
    return _WMGlobal.dataset.getTypeList(type);
};

function saveVariables(){
    localStorage.setItem("variables",JSON.stringify({maxFormID:MAX_FORM_ID,maxInputID:MAX_INPUT_ID}));
}

function loadVariables(){

    var storedVars = localStorage.getItem('variables');

    if (typeof storedVars === "undefined" || storedVars === null || storedVars === undefined) {
        MAX_FORM_ID = 0;
        MAX_INPUT_ID = 0
        return;
    } else {
        var parsed = JSON.parse(storedVars);
        MAX_FORM_ID = parsed.maxFormID;
        MAX_INPUT_ID = parsed.maxInputID;
    }

}




;(function (_WMGlobal) {

    "use strict";

    var Dataset = {
      array : []
    };


    Dataset.addKey = function(type,key,value){

        if(!type){
            console.error('dataset add : not type provided');
            return -1;
        }

        if(!key){
            console.error('dataset add : not key provided');
            return -1;
        }

        var length = this.array.length;

        for(var i = 0; i < length; i++){
            if(this.array[i].key === key){
                return -1
            }
        }

        this.array.push({"type" : type, "key" : key, "value" : value || ""});

        return this.array.length;
    };

    Dataset.getKey = function(key){
        if(!key){
            console.error('dataset get : key not provided');
            return -1;
        }

        var length = this.array.length;
        for(var i = 0; i < length; i++){
            if(this.array[i].key === key){
                return this.array[i];
            }
        }

        console.error('dataset get : not such a key');

    };

    Dataset.getDataset = function(){
        return this.array;
    };

    Dataset.setDataset = function(dataset){
        if(!dataset){
            console.error('dataset setDataset : not dataset provided');
            return -1;
        }

        this.array = dataset;
        return this.array.length;
    };

    Dataset.deleteDataset = function(){
        var length = this.array.length;
        return this.array.splice(0,length);
    };

    Dataset.removeKey = function(key){
        if(!key){
            console.error('dataset remove : key not provided');
            return -1;
        }

        var length = this.array.length;

        for(var i = 0; i < length; i++){
            if(this.array[i].key === key){
                return this.array.splice(i,1);
            }
        }

        console.error('dataset remove : not such a key in dataset');
    };

    Dataset.getTypeList = function (type) {

        if(!type){
            console.error('dataset getTypeList : type not provided');
            return -1;
        }

        var list = [],
            length = this.array.length;

        for(var i = 0; i < length; i++){
            if(this.array[i].type === type){
                list.push(this.array[i]);
            }
        }
        return list;
    };

    Dataset.loadFromLocalStorage = function(){

        var dataset = localStorage.getItem('dataset');
        if (dataset === null || dataset === undefined || dataset === "undefined") {
            return;
        } else {
            this.setDataset(JSON.parse(dataset));
        }
        //
        //console.log(dataset);
        //console.log(this.array);
    };

    Dataset.saveToLocalStorage = function(){
        localStorage.setItem("dataset",JSON.stringify(this.array));
    };

    _WMGlobal.dataset = Dataset;

}(_WMGlobal));(function (_WMGlobal) {

    "use strict";

    var Forms = {
        array : []
    };


    Forms.addForm = function(name,inputs){

        if(!name){
            console.error('Forms addForm : not name provided');
            return -1;
        }
        if(!inputs){
            inputs = [];
        }

        this.array.push({
            name:name || "", id : _WMGlobal.getFormID() , inputs : inputs ||[]
        });

        return this.array[this.array.length - 1];

    };

    Forms.getForm = function(id){

        if( id === undefined ){
            console.error('Forms getForm : not id provided')
            return;
        }

        var length = this.array.length;
        for(var i = 0; i <length; i++){
            if(this.array[i].id === id ){
                return this.array[i];
            }
        }

        console.error('form to get not found');
        return;
    };

    Forms.getFormsByList = function(idList){
        if(!idList ){
            console.error('Forms getFormList : list not provided');
            return;
        }

        var list = [],
            listLength = idList.length;

        for(var i = 0; i < listLength; i++){
            list.push(this.getForm(idList[i]));
        }
    };

    Forms.removeForm = function(id){
        if(!id){
            console.error('Forms removeForm : id not provided');
            return false;
        }

        var length = this.array.length;
        for(var i = 0; i < length; i++){
            if(this.array[i].id === id){
                return this.array.splice(i,1);
            }
        }

        console.error('forms RemoveForm : not such a form');
        return;
    };

    Forms.getForms = function(){
        return this.array;
    };

    Forms.setForms = function(forms){
        if(!forms){
            console.error('forms setForms : not forms provided');
            return -1;
        }

        this.array = forms;

        return this.array.length;
    };

    Forms.deleteForms = function(){
        var length = this.array.length;
        return this.array.splice(0,length);
    };

    Forms.loadFromLocalStorage = function(){
        var forms = localStorage.getItem('forms');
        if (forms === null || forms === undefined || forms === "undefined") {
            return;
        } else {
            this.setForms(JSON.parse(forms));
        }
    };

    Forms.saveToLocalStorage = function(){
        localStorage.setItem("forms",JSON.stringify(this.array));
    };


    _WMGlobal.forms = Forms;

}(_WMGlobal));(function (_WMGlobal) {

    "use strict";

    var Mapping = {
        array : []
    };


    Mapping.addMapping = function(transitionID,formID){
        if(transitionID === undefined){
            console.error('mapping addMapping : not transitionID provided');
            return -1;
        }
        if(formID === undefined){
            console.error('mapping addMapping : not formID provided');
            return -1;
        }

        var length = this.array.length;

        for(var i = 0; i < length; i++){
            if(this.array[i].transitionID === transitionID){
                this.array[i].formID  = formID;
                return length;
            }
        }

        this.array.push({
            transitionID : transitionID , formID : formID
        });

        return this.array.length;

    };

    Mapping.isEmpty = function(){
        return this.array.length === 0 ? true : false;
    };

    Mapping.getFormID = function(transitionID){
        if(transitionID === undefined){
            console.error('mapping getFormID : getFormID not provided');
            return -1;
        }

        if(this.isEmpty()){
            return -1;
        }

        var length = this.array.length;
        for(var i = 0; i < length; i++){
            if(this.array[i].transitionID === transitionID){
                return this.array[i].formID;
            }
        }

        console.error('mapping get : not such a key');
        return -1;
    };

    Mapping.getMappedForms = function(){
        var list = [],
            length = this.array.length;
        for(var i = 0; i < length; i++ ){
            list.push(this.array[i].formID);
        }

        return list;
    };

    Mapping.getMappedTransitions = function(){
        var list = [],
            length = this.array.length;

        for(var i = 0; i < length; i++ ){
            list.push(this.array[i].transitionID);
        }

        return list;
    };


    Mapping.hasForm = function(transitionID){
        if(!transitionID){
            console.error('mapping hasForm : transitionID not provided');
            return false;
        }

        if(this.isEmpty()){
            return false;
        }

        var length = this.array.length;
        for(var i = 0; i < length; i++){
            if(this.array[i].transitionID === transitionID){
                return true;
            }
        }

        console.error('dataset get : not such a key');
        return false;
    };

    Mapping.removeMappingByTransitionID = function(transitionID){
        if(!transitionID){
            console.error('mapping removeMappingByTransitionID : getFormID not provided');
            return false;
        }

        var length = this.array.length;
        for(var i = 0; i < length; i++){
            if(this.array[i].transitionID === transitionID){
                 return this.array.splice(i,1);
            }
        }

        console.error('mapping removeFromMapping : not such a mapping');
    };

    Mapping.removeMappingByFormID = function(formID){
        if(formID === undefined){
            console.error('mapping removeMappingByTransitionID : formID not provided');
            return false;
        }

        var length = this.array.length;
        for(var i = 0; i < length; i++){
            if(this.array[i].formID === formID){
                return this.array.splice(i,1);
            }
        }

        console.error('mapping removeFromMapping : not such a mapping');
    };

    Mapping.getMapping = function(){
        return this.array;
    };

    Mapping.setMapping = function(mapping){
        if(!mapping){
            console.error('mapping setMapping : not mapping provided');
            return -1;
        }

        this.array = mapping;
        return this.array.length;
    };

    Mapping.deleteMapping = function(){
        var length = this.array.length;
        return this.array.splice(0,length);
    };



    Mapping.loadFromLocalStorage = function(){
        var mapping = localStorage.getItem('mapping');

        if (mapping === null || mapping === undefined || mapping === "undefined") {
            return;
        } else {
            this.setMapping(JSON.parse(mapping));
        }

        //console.log(mapping);
        //console.log(this.array);
    };

    Mapping.saveToLocalStorage = function(){
        localStorage.setItem("mapping",JSON.stringify(this.array));
    };


    _WMGlobal.mapping = Mapping;

}(_WMGlobal));(function (_WMGlobal) {

    "use strict";

    function formControls($parent,$transitionEl,form){
        this.init($parent,$transitionEl,form);
    }

    formControls.prototype.init = function($parent,$transitionEl,form){
        if(!$parent){
            console.error('formControls init : not $parent provided');
            return;
        }

        if(!$transitionEl){
            console.error('formControls init : not $transitionEl provided');
            return;
        }
        this.$parent = $parent;
        this.$transition = $transitionEl;
        this.form = form;
        this.id = $transitionEl.attr('id') || $transitionEl.attr('data-id');
        this.$el = $(controlsHTML);
        this.$el.attr('data-id',this.id);
        this.$el.css('top',this.$transition.position().top - 132);
        this.$el.css('left',this.$transition.position().left -120 + 20);

        this.$menu = this.$el.find('.action-selector');
        this.$remove = this.$el.find('.remove-form-confirm');
        this.$rename = this.$el.find('.change-form-name-confirm');

        this.$editIcon = this.$el.find('.edit-form');
        this.$renameIcon = this.$el.find('.change-form');
        this.$removeIcon = this.$el.find('.remove-form');


        this.$menu.find('.headline').text(this.form.name);
        this.$remove.find('.headline').text(this.form.name);
        this.$rename.find('.form-name').val(this.form.name);

        this.$parent.append(this.$el);

        this.attachEventHandlers.call(this);
    };


    formControls.prototype.attachEventHandlers = function(){

        this.$transition.on('click',function(){openControls.call(this)}.bind(this));

        this.$el.find('.close-controlls').on('click',function(){closeControls.call(this)}.bind(this));

        this.$editIcon.on('click',function(){openEdit.call(this)}.bind(this));

        this.$renameIcon.on('click',function(){openRename.call(this)}.bind(this));

        this.$removeIcon.on('click',function(){openRemove.call(this)}.bind(this));

        this.$rename.find('.cancel').on('click',function(){cancelRename.call(this)}.bind(this));

        this.$remove.find('.cancel').on('click',function(){cancelRemove.call(this)}.bind(this));

        this.$rename.find('.save').on('click',function(){confirmRename.call(this)}.bind(this));

        this.$remove.find('.remove').on('click',function(){confirmRemove.call(this)}.bind(this));

    };

    function closeControls(){
        this.$el.fadeOut(100);
    }

    function openEdit(){
        _WMGlobal.formMapper.destroyMapper();
        _WMGlobal.formCreator.init(this.form);
    }

    function openControls(){
        console.log('click');
        this.$el.show();
    }

    function  openRename(){
        this.$menu.hide(0,function(){
            this.$rename.find('.form-name').val(this.form.name);
            this.$rename.show();
            this.$rename.find('input').focus();
        }.call(this));
    }

    function openRemove(){
        this.$menu.hide(0,function(){
            this.$remove.find('.headline').val(this.form.name);
            this.$remove.show();
        }.call(this));
    }

    function cancelRename(){
        this.$rename.hide(0,function(){
            this.$menu.find('.headline').val(this.form.name);
            this.$menu.show();
        }.call(this));
    }

    function cancelRemove(){
        this.$remove.hide(0,function(){
            this.$menu.find('.headline').val(this.form.name);
            this.$menu.show();
        }.call(this));

    }

    function confirmRename(){
        this.$rename.hide(0,function(){
            var newname = this.$rename.find('.form-name').val();
            this.form.name = newname;
            this.$menu.find('.headline').text(newname);
            this.$menu.show();
            _WMGlobal.saveData();
        }.call(this));
    }

    function confirmRemove(){
        this.$remove.hide(100,function(){
            _WMGlobal.formMapper.removeFromMapping(this.form.id,this.id);
            this.$el.remove();
            _WMGlobal.saveData();
            _WMGlobal.saveData();
        }.call(this));
    }



    var controlsHTML =
        '<div class="transition-controlls"  data-id=""> \
            <div class="close-controlls"><div class="icon-close"></div></div>\
            <div class="action-selector">\
                <div class="headline"></div> \
                <div class="edit-form">\
                    <div class="icon-add"></div>\
                    <div class="label">Edit</div>\
                </div>\
                <div class="change-form"><div class="icon-test1"></div><div class="label">Rename</div></div>\
                <div class="remove-form"><div class="icon-close"></div><div class="label">Remove</div></div> \
            </div>\
            \
            <div class="remove-form-confirm" >\
                <div class="headline"></div> \
                <div class="question">Are you sure you want to remove this form from transition ?</div>\
                <div class="cancel">Cancel</div>\
                <div class="remove">Remove</div>\
            </div>\
            \
            <div class="change-form-name-confirm">\
                <div class="headline">Rename form</div> \
                <input class="form-name" value="Example of name">\
                <div class="cancel">Cancel</div>\
                <div class="save">Save</div>\
            </div>\
            \
        </div>\ ' ;

    _WMGlobal.formControls = formControls;

}(_WMGlobal));(function (_WMGlobal) {
    "use strict";

    var _utils = {};

    _utils.getOnOffValue = function($el){
        if($el.hasClass('on-selected')){
            return true;
        }else{
            return false;
        }
    };

    _utils.attachAddToDatasetHandler = function ($el,type){
        $el.find('.dataset-add-icon').on('click',function(){
            var $target = $(this);
            var $datasetEl = $target.closest('.block').find('.add-dataset-block');

            if($datasetEl.hasClass('shown')){
                $datasetEl.removeClass('shown');
                $datasetEl.stop().fadeOut(100);
                return;
            }

            $datasetEl.stop().fadeIn(200);
            $datasetEl.addClass('shown');
        });

        $el.find('.dataset-save-button').on('click',function(){
            var $target = $(this);
            var $datasetEl = $target.closest('.block').find('.add-dataset-block');
            var $inputEl =  $target.closest('.block').find('.new-dataset');


            var newSelected = $inputEl.val().trim();
            if(newSelected === '' || _WMGlobal.addToDataset(type,newSelected) === false){
                $inputEl.focus();
                $inputEl.addClass('error');
                return;
            }


            $inputEl.removeClass('error');

            _WMGlobal.utilities.popupBuildSelectboxDataset($el,type);

            $el.find('.dataset').val(newSelected);
            $datasetEl.stop().fadeOut(100);
            $datasetEl.removeClass('shown');
            $target.closest('.block').find('.new-dataset').val('');
            _WMGlobal.saveData();
        });

        $el.find('.dataset-cancel-button').on('click',function(){
            var $target = $(this);
            var $datasetEl = $target.closest('.block').find('.add-dataset-block');

            $datasetEl.stop().fadeOut(100);
            $datasetEl.removeClass('shown');
            $target.closest('.block').find('.new-dataset').val('');

        })
    };

    _utils.popupBuildSelectboxDataset = function($el,type){

        var $select = $el.find('.dataset');
        $select.empty();
        $select.append($('<option selected value="undefined"> Select from dataset </option>'));

        //only dataset of selected type
        var dataset = _WMGlobal.getDatasetTypeList(type);
        //console.log(dataset);
        //console.log($select);
        //console.log(type);

        for(var data in dataset) {
            var $newOpt =   $('<option value="'+dataset[data].key+'">'+dataset[data].key+'</option>');
            $select.append($newOpt);
        }
    };

    _utils.attachOnOffHanlder = function($el){
        var $mov = $el.find('.mover');
        $mov.on('click',function(){
            var $target = $(this);
            var $description = $target.closest('.block').find('.description-block');

            if($target.hasClass('off-selected')) {
                $target.removeClass('off-selected');
                $target.addClass('on-selected');

                if($description.length !== 0){
                    $description.fadeIn(200);
                }
            }else{
                $target.removeClass('on-selected');
                $target.addClass('off-selected');

                if($description.length !== 0){
                    $description.fadeOut(100);
                    $description.find('.description').val('');
                    $description.find('.description').trigger('input');
                }
            }
        });
    };

    _utils.attachAddChoiceHandler = function($el){
        var $choices = $el.find('.choices');
        $choices.find('.add-choice-icon').off('click').on('click',function(){
            _utils.addChoice($el);
            $choices.trigger('choice:added');
        });
    };

    _utils.addChoice = function ($el){
        var $choices = $el.find('.choices');

        var choiceHTML =
            ' <div class="choice-block"> \
                <input type="text" class="choice"> \
                <div class="controls"> \
                    <div class="remove-choice-icon"> \
                        <div class="icon-close"></div>\
                    </div>\
                </div>\
            </div> \ ';
        var $choice = $(choiceHTML);
        var $last = $choices.find('.choice-block:last');
        _utils.attachRemoveChoiceHandler($choice,$el);
        _utils.attachChangeChoiceHandler($choice,$el);
        $choice.css('display','none');
        $choice.insertBefore($last);
        $choice.fadeIn(200);

        return $choice;
    };

    _utils.loadChoices = function($el,data){
        var $choices = $el.find('.choices');
        if(data === undefined){
            return;
        }

        //make a copy od data
        var choicesdata = data.slice();

        $choices.find('.choice').val(choicesdata.pop());

        while(choicesdata.length > 0){
            _utils.addChoice($el).find('.choice').val(choicesdata.shift());
        }

    };

    _utils.getChoices = function($el){
        var list = [];
        $el.find('.choices').find('.choice').each(function(){
            var $choice = $(this);
            if($choice.val().trim() !== '' && $choice.val().trim() !== undefined ){
                list.push($choice.val().trim());
            }
        });

        return list;
    };

    _utils.attachRemoveChoiceHandler = function($choice,$el){
        var $choices = $el.find('.choices');

        $choice.find('.remove-choice-icon').on('click',function(event){
            $choice.fadeOut(100,function(){
                $choice.remove();
                $choices.trigger('choice:removed');
            });
        })
    };

    _utils.attachChangeChoiceHandler = function($choice,$el){
        var $choices = $el.find('.choices');

        $choice.find('.choice').on('input',function(event){
            $choices.trigger('choice:changed');
        })
    };

    _utils.noChoiceHanlder = function($el,empty){
        var error = $el.find('.choices').find('.error');
        var choices =  $el.find('.choices').find('.choice');
        var $first = choices.first();
        if(empty){
            if(error.length === 0){
                $first.addClass('error');
            }

            $first.focus();
            return false;
        }
        error.removeClass('error');
        return true;
    };

    _utils.setOnOffValue = function($el,status){

        if(status === true){
            $el.removeClass('off-selected').addClass('on-selected');
        } else {
            $el.removeClass('on-selected').addClass('off-selected');
        }
    };

    _utils.attachBasicPreviewHandlers = function($popup){
        var $preview = $popup.find('.preview');
        var $toolbar = $popup.find('.toolbar-editor');
        var $previewBlock = $preview.find('.preview-block');

        $toolbar.find('input.fieldname[type=text]').on('input',function(event){
            if($(event.target).val().trim() === '' || $(event.target).val().trim() === undefined){
                $previewBlock.css('visibility','hidden');
                return;
            }

            $previewBlock.css('visibility','visible');
            $preview.find('.fieldname').text($(event.target).val().trim());
        });

        $toolbar.find('.description-block').find(".description").on('input change',function(event){
            $preview.find('.description').text($(event.target).val().trim());
        });

    };


    _WMGlobal.utilities = _utils;
}(_WMGlobal));/**
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
}(_WMGlobal));(function (_WMGlobal) {
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
                <div class="icon-longanswer"></div> \
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
                <div class="heading">Max length \
                    <div class="description"> \
                        <div class="icon-description"></div> \
                    </div> \
                </div> \
                <div class="block-body"> \
                    <input type="text" class="max-length"> \
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

    _WMGlobal.longAnswer = _la;
}(_WMGlobal));/**
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
        <div class="icon-selectbox"></div> \
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

    _WMGlobal.selectboxAnswer = _sb;
}(_WMGlobal));(function (_WMGlobal) {
    "use strict";

    var _sa = {};

    _sa.saveAnswer = function (popup,data){

        var max_length = $(popup).find('input.max-length[type=text]').val();
        data['max-length'] = max_length;
    };

    _sa.validateSaving = function($popup,data){

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

    _sa.buildPopup = function(popup, form){
        buildToolbar(popup,form);
        buildPreview(popup,form);
        attachPreviewEventHanlers(popup);
        _WMGlobal.utilities.attachBasicPreviewHandlers(popup);

    };

    function buildToolbar (popup,data){
        var $toolb = $(shortAnswerToolbarHTML);
        _WMGlobal.utilities.attachOnOffHanlder($toolb);
        _WMGlobal.utilities.attachAddToDatasetHandler($toolb,'shortanswer');
        _WMGlobal.utilities.popupBuildSelectboxDataset($toolb,'shortanswer');

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
        var $preview = $(shortAnswerPreviewHTML);

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


    var shortAnswerPreviewHTML =
        '<div class="preview-block"> \
            <div class="fieldname"></div> \
            <div class="description"></div> \
            <div class="shortanswer"> \
                <input  class="shortanswer-input" type="text"> \
            </div> \
            <div class="preview-save"> \
                <div class="preview-back-button">Back</div> \
             <div class="preview-next-button">Next</div> \
             </div> \
        </div> ';


    var shortAnswerToolbarHTML =
        '<div class="inputfield-name"> \
            <div class="inputfield-icon"> \
                <div class="icon-shortanswer"></div> \
            </div> \
            <div class= "inputfield-name-inner">Short answer</div> \
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
                <div class="heading">Max length \
                    <div class="description"> \
                        <div class="icon-description"></div> \
                    </div> \
                </div> \
                <div class="block-body"> \
                    <input type="text" class="max-length"> \
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

    _WMGlobal.shortAnswer = _sa;
}(_WMGlobal));(function (_WMGlobal) {
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

}(_WMGlobal));(function (_WMGlobal) {
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
                            <div class="icon-add"></div>\
                            <div class="label">Select form</div>\
                        </div>\
                    </div>\
                    <div class="new-form">\
                        <div class="new-form-icon">\
                            <div class="icon-shortanswer"></div>\
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
                <div class="icon-close"></div>\
            </div>\
        </div>\ ';


    _WMGlobal.formSelector = _fs;


}(_WMGlobal))
;(function (_WMGlobal) {
"use strict";

    var _fm = {
        $el : {}
    };

    _fm.attachEvents = function () {

        $(document).off('click').on('click',function(event){

            if( (Object.keys(_WMGlobal.formSelector.$el).length !== 0)){
                if(_WMGlobal.formSelector.$el.has( $(event.target) ).length === 0 && _WMGlobal.formSelector.$el.hasClass('opened')){
                    _WMGlobal.formSelector.destroySelector();
                }
            }
        });

        _fm.$el.find(".transition").add(".transition-icon").on('click',function(event){
            var transitionID = $(event.target).attr('id');

            if(_WMGlobal.mapping.hasForm(transitionID)) {

            }else{
                _WMGlobal.formSelector.init(transitionID);
                return;
            }

        });

        _fm.$el.find(".close-button").on('click', function (event) {
            _WMGlobal.sendFormsJSON();
        });
    };

    _fm.init = function(){
        _fm.showPetriNet();
        _fm.addControls();
        _fm.attachEvents();
    };

    _fm.showPetriNet = function(){
        _fm.$el = $(petrinetHTML);

        addIconsToMapped();

        _WMGlobal.$el.append(_fm.$el);
        _fm.$el.show();
    };

    _fm.destroyMapper = function(){
        _fm.$el.hide(0,function(){
            _fm.$el.remove();
            _fm.$el = {};
        });

    };


    _fm.createNewMapping = function(transitionID, formID){

        _WMGlobal.mapping.addMapping(transitionID,formID);
        _WMGlobal.saveData();
    };


    _fm.removeFromMapping = function(formID,transitionID){
        var removed =  _WMGlobal.mapping.removeMappingByFormID(formID);
        if(removed){
            removeIcon(transitionID);
        }
        return removed;
    };

    _fm.addControls = function(){

        var parent = _fm.$el.find('svg');
        var mapped = _WMGlobal.mapping.getMappedTransitions();

        var length = mapped.length;
        for(var i = 0; i < length; i++){
            var transition = parent.find('.transition[id="'+mapped[i]+'"]');
            var icon = parent.find('image[id="'+mapped[i]+'"]');
            var form = _WMGlobal.getFormById(_WMGlobal.mapping.getFormID(transition.attr('id')));
            if(form){
                var control = new  _WMGlobal.formControls(_fm.$el,transition.add(icon),form);
            }
        }

    };

    function addIconsToMapped(){
        var parent = _fm.$el.find('svg');
        var mapped = _WMGlobal.mapping.getMappedTransitions();
        var length = mapped.length;
        for(var i = 0; i < length; i++){
            var transition = parent.find('.transition[id="'+mapped[i]+'"]');
            addIcon(parent,transition);
        }
    }

    function addIcon(parent,transition){

        var transitionID = transition.attr('id');
        var width = parseInt(transition.attr('width')) - 10;
        var height = parseInt(transition.attr('height')) - 10;
        var x = parseInt(transition.attr('x')) + 5;
        var y = parseInt(transition.attr('y')) + 5;

        var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','height',height);
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','width',width);
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','x',x);
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','y',y);
        svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href','src/content/svg/bookmark49.svg');
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','class','transition-icon');
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','id',transitionID);

        parent.append(svgimg);
        parent.html(parent.html());
    }

    function removeIcon(transitionID){
        var parent = _fm.$el.find('svg');
        var icon = parent.find('image[id="'+transitionID+'"]');
        icon.remove();
    }


    var petrinetHTML =
        '<div class="formMapper"> \
            <svg width="800" height="500"> \
                 <circle id="0" cx="231" cy="182" r="20" fill="white" stroke="black" stroke-width="2" class="place"></circle>\
                 <text x="226.5" y="185.75" font-family="verdana" font-weight="bold" font-size="12" fill="black">8</text>\
                 <rect id="1" x="336" y="68" width="40" height="40" fill="white" class="transition" stroke="green" stroke-width="2"></rect>\
                 <rect id="2" x="307" y="248" width="40" height="40" fill="white" class="transition" stroke="green" stroke-width="2"></rect>\
                 <rect id="3" x="592" y="166" width="40" height="40" fill="white" class="transition" stroke="green" stroke-width="2"></rect>\
                 <circle id="4" cx="448" cy="184" r="20" fill="white" stroke="black" stroke-width="2" class="place"></circle>\
                 <text x="443.5" y="187.75" font-family="verdana" font-weight="bold" font-size="12" fill="black">1</text>\
                 <circle id="5" cx="769" cy="181" r="20" fill="white" stroke="black" stroke-width="2" class="place"></circle>\
                 <text x="764.5" y="184.75" font-family="verdana" font-weight="bold" font-size="12" fill="black">1</text>\
                 <polyline points="246.9846416619502,169.97954947021344 328.00767916902487,109.05022526489327" fill="none" stroke-width="2" stroke="black"></polyline>\
                 <polygon points="336,103.04 331.01279180147156,113.04638568038084 325.0025665365783,105.05406484940573" stroke="black" fill="black"></polygon>\
                 <rect x="290.49232083097513" y="139.50977473510673" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect>\
                 <text font-family="verdana" font-weight="bold" font-size="12"></text>\
                 <polyline points="245.89670671446117,195.3449664317048 299.5516466427694,243.41085011748095" fill="none" stroke-width="2" stroke="black"></polyline>\
                 <polygon points="307,250.08333333333334 296.21540503484323,247.13502679609624 302.8878882506956,239.68667343886565" stroke="black" fill="black"></polygon>\
                 <rect x="275.4483533572306" y="225.71414988251905" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect><text font-family="verdana" font-weight="bold" font-size="12"></text>\
                 <polyline points="375.1666666666667,108 427.24283910293155,162.34035384653728" fill="none" stroke-width="2" stroke="black"></polyline>\
                 <polygon points="434.1618927352877,169.5602358976915 423.6328980773544,165.79988066271537 430.8527801285087,158.8808270303592" stroke="black" fill="black"></polygon>\
                 <rect x="403.6642797009772" y="141.78011794884577" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect><text font-family="verdana" font-weight="bold" font-size="12"></text>\
                 <polyline points="347,254.11570247933884 423.3562507872838,201.1080573046956" fill="none" stroke-width="2" stroke="black"></polyline>\
                 <polygon points="431.5708338581892,195.40537153646372 426.2075936713997,205.21534884014827 420.50490790316786,197.00076576924286" stroke="black" fill="black"></polygon>\
                 <rect x="388.2854169290946" y="227.7605370079013" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect><text font-family="verdana" font-weight="bold" font-size="12"></text>\
                 <polyline points="467.9985129558699,184.24388430433987 582.000743522065,185.63415540880567" fill="none" stroke-width="2" stroke="black"></polyline><polygon points="592,185.7560975609756 581.93977244598,190.63378364777316 582.06171459815,180.63452716983818" stroke="black" fill="black"></polygon>\
                 <rect x="528.999256477935" y="187.99999093265774" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect><text font-family="verdana" font-weight="bold" font-size="12"></text>\
                 <polyline points="632,185.36305732484075 739.015202036022,181.95492987146426" fill="none" stroke-width="2" stroke="black"></polyline>\
                 <polygon points="749.0101346906813,181.6366199143095 739.1743570145993,186.95239619879393 738.8560470574446,176.95746354413458" stroke="black" fill="black"></polygon><rect x="689.5050673453406" y="186.49983861957514" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect>\
                 <text font-family="verdana" font-weight="bold" font-size="12"></text>\
             </svg> \
            <div class="close-mapper"> \
                <div class="close-button">Log data </div> \
            </div> \
        </div>';

    var transitionPop =
        '<div class="transition-controlls"  data-id=""> \
            <div class="close-controlls"><div class="icon-close"></div></div>\
            <div class="action-selector">\
                <div class="headline"></div> \
                <div class="edit-form">\
                    <div class="icon-add"></div>\
                    <div class="label">Edit</div>\
                </div>\
                <div class="change-form"><div class="icon-test1"></div><div class="label">Rename</div></div>\
                <div class="remove-form"><div class="icon-close"></div><div class="label">Remove</div></div> \
            </div>\
            \
            <div class="remove-form-confirm" >\
                <div class="headline"></div> \
                <div class="question">Are you sure you want to remove this form from transition ?</div>\
                <div class="cancel">Cancel</div>\
                <div class="remove">Remove</div>\
            </div>\
            \
            <div class="change-form-name-confirm">\
                <div class="headline">Rename form</div> \
                <input class="form-name" value="Example of name">\
                <div class="cancel">Cancel</div>\
                <div class="save">Save</div>\
            </div>\
            \
        </div>\ ' ;




    _WMGlobal.formMapper = _fm;


}(_WMGlobal));(function(){
    _WMGlobal.init()
})();
