(function (_WMGlobal) {

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

}(_WMGlobal))