"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"addr":{"type":"number"},"msg":{},"size":{"type":"number"},"stat":{"type":"number"}},"required":["addr","msg","size","stat"],"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.addr === undefined) && (missing0 = "addr")) || ((data.msg === undefined) && (missing0 = "msg"))) || ((data.size === undefined) && (missing0 = "size"))) || ((data.stat === undefined) && (missing0 = "stat"))){
validate20.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.addr !== undefined){
let data0 = data.addr;
const _errs1 = errors;
if(!((typeof data0 == "number") && (isFinite(data0)))){
validate20.errors = [{instancePath:instancePath+"/addr",schemaPath:"#/properties/addr/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.size !== undefined){
let data1 = data.size;
const _errs3 = errors;
if(!((typeof data1 == "number") && (isFinite(data1)))){
validate20.errors = [{instancePath:instancePath+"/size",schemaPath:"#/properties/size/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.stat !== undefined){
let data2 = data.stat;
const _errs5 = errors;
if(!((typeof data2 == "number") && (isFinite(data2)))){
validate20.errors = [{instancePath:instancePath+"/stat",schemaPath:"#/properties/stat/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}
