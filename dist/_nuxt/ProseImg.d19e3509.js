import{x as r,m as n,o as c,c as o,a,h as u,t as l,K as h,G as d}from"./entry.88a7fb74.js";const f={class:"figure"},g=["src","alt","width","height"],S=r({__name:"ProseImg",props:{src:{type:String,default:""},alt:{type:String,default:""},width:{type:[String,Number],default:void 0},height:{type:[String,Number],default:void 0}},setup(t){const e=t,i=n(()=>{var s;return(s=e.src)!=null&&s.startsWith("/")&&!e.src.startsWith("//")?h(e.src,d().app.baseURL):e.src});return(s,m)=>(c(),o("figure",f,[a("img",{src:u(i),alt:t.alt,width:t.width,height:t.height,class:"mx-auto"},null,8,g),a("figcaption",null,l(t.alt),1)]))}});export{S as default};