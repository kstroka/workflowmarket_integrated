"use strict";

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




