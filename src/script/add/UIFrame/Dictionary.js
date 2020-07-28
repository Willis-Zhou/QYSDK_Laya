export  class Dictionary  {

    constructor(){
        this.keys=[];
        this.values=[];
    }

    /**
     * 添加一项
     * @param {any} key 
     * @param {any} val 
     */
    addKey(key,val){
        if(this.hasKey(key)){
            console.error("字典有相同的键值:",key);
            return false;
        }else{
            this.keys.push(key);
            this.values.push(val);
        }
    }
    
    /**
     * 获得一项
     * @param {any} key 
     */
    getValue(key){
        let index=this.keys.indexOf(key)
        if(index>=0){
            return this.values[index];
        }else{
            return null;
        }
    }

    hasKey(key){
        return this.keys.indexOf(key)!=-1;
    }

    removeKey(key){
        let index=this.keys.indexOf(key);
        if(index>=0){
            this.keys.splice(index,1);
            this.values.splice(index,1);
        }
    }

    /**
     * 获得数量
     */
    getCount(){
        return this.keys.length;
    }

    getKeys(){
        return this.keys;
    }

    getValues(){
        return this.values;
    }

    /**
     * 排序
     * @param {function} fuc 
     */
    sortByKey(){//根据key的大小排序 key必须是number
       
    }

    sortByValue(){//根据value大小排序

    }

    clear(){
        this.keys=[];
        this.values=[];
    }
}