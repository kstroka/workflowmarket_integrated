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

        console.log('add',this.array[this.array.length - 1]);
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

    Forms.setForm = function(id,newForm){

        if( id === undefined ){
            console.error('Forms setForm : not id provided')
            return;
        }

        var length = this.array.length;
        for(var i = 0; i <length; i++){
            if(this.array[i].id === id ){
                this.array[i] = newForm;
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
        removeEl.call(this);
        localStorage.setItem("forms",JSON.stringify(this.array));
    };

    function isCyclic (obj) {
        var seenObjects = [];

        function detect (obj) {
            if (obj && typeof obj === 'object') {
                if (seenObjects.indexOf(obj) !== -1) {
                    return true;
                }
                seenObjects.push(obj);
                for (var key in obj) {
                    if (obj.hasOwnProperty(key) && detect(obj[key])) {
                        console.log(obj, 'cycle at ' + key);
                        return true;
                    }
                }
            }
            return false;
        }

        return detect(obj);
    }

    function removeEl(){
        if(this.array === undefined){
            return;
        }
        var formslen = this.array.length;
        console.log('formsLen',formslen);
        for(var i = 0; i < formslen; i++){

            var inputslen = this.array[i].inputs.length;
            // console.log('inputslen',inputslen);
            // console.log(this.array);
            // console.log(this.array[i]);
            // console.log(i);
            // console.log('=====');

            for(var j = 0; j < inputslen; j++){
                if( this.array[i].inputs[j].$el !== undefined){
                    delete this.array[i].inputs[j].$el;
                }
            }
        }

    }

    _WMGlobal.forms = Forms;

}(_WMGlobal))