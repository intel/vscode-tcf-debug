"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"AddressSpace":{"type":"string"},"Text":{"type":"string"},"Type":{"type":"string"},"Value":{"type":"number"}},"required":["AddressSpace","Text","Type","Value"],"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.AddressSpace === undefined) && (missing0 = "AddressSpace")) || ((data.Text === undefined) && (missing0 = "Text"))) || ((data.Type === undefined) && (missing0 = "Type"))) || ((data.Value === undefined) && (missing0 = "Value"))){
validate20.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.AddressSpace !== undefined){
const _errs1 = errors;
if(typeof data.AddressSpace !== "string"){
validate20.errors = [{instancePath:instancePath+"/AddressSpace",schemaPath:"#/properties/AddressSpace/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Text !== undefined){
const _errs3 = errors;
if(typeof data.Text !== "string"){
validate20.errors = [{instancePath:instancePath+"/Text",schemaPath:"#/properties/Text/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Type !== undefined){
const _errs5 = errors;
if(typeof data.Type !== "string"){
validate20.errors = [{instancePath:instancePath+"/Type",schemaPath:"#/properties/Type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Value !== undefined){
let data3 = data.Value;
const _errs7 = errors;
if(!((typeof data3 == "number") && (isFinite(data3)))){
validate20.errors = [{instancePath:instancePath+"/Value",schemaPath:"#/properties/Value/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
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
