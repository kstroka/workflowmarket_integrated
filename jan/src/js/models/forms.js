(function (_WMGlobal) {

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

}(_WMGlobal))