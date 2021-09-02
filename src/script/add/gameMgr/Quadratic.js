export default class Quadratic {

    constructor() { 
        this.k=1;
        this.a=1;//k(x-a)(x+a)
    }
    
   
     createFun(k,a){
        this.a=a;
        this.k=k;
    }

    getY(x){
        return -this.k*(x-this.a)*x;
    }
}