export default class List  {

    constructor(){
        this.values=[];
    }

    /**
     * 添加一项
     * @param {any} value 
     */
    add(value){
        this.values.push(value);
    }

    /**
     * 获取一项
     * @param {number} index 
     */
    getValue(index){
        if(this.values.length<=index){
            return null;
        }else{
            return this.values[index];
        }
    }

    /**
     * 移除一项
     * @param {any} value 
     */
    remove(value){
        if(this.values.indexOf(value)>=0){
            this.values.remove(value);
        }
       
    }

    getCount(){
        return this.values.length;
    }

    /**
     * 排序
     * @param {function} func 
     */
    sort(func){
        let temp;
        for(var i=0;i<this.values.length;i++){//每一轮找出最小的在前面
              temp=this.values[i];
            for(var j=i+1;j<this.values.length;j++){
                if(func(temp,this.values[j])==-1){//比较 小的往上走
                   
                }else if(func(temp,this.values[j])==1){
                   // console.log("交换之前:",this.values[i],this.values[j]);
                    this.values[i]=this.values[j];
                    this.values[j]=temp;
                    temp=this.values[i];
                   //console.log("交换之后:",this.values[i],this.values[j]);
                }else{
                    
                }
            }
        }
    }

    clear(){
        this.values.splice(0,this.values.length);
    }
}