"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"ISA":{"type":"string"},"OpcodeValue":{"type":"boolean"},"PseudoInstructions":{"type":"boolean"},"Simplified":{"type":"boolean"}},"required":["ISA","OpcodeValue","PseudoInstructions","Simplified"],"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.ISA === undefined) && (missing0 = "ISA")) || ((data.OpcodeValue === undefined) && (missing0 = "OpcodeValue"))) || ((data.PseudoInstructions === undefined) && (missing0 = "PseudoInstructions"))) || ((data.Simplified === undefined) && (missing0 = "Simplified"))){
validate20.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.ISA !== undefined){
const _errs1 = errors;
if(typeof data.ISA !== "string"){
validate20.errors = [{instancePath:instancePath+"/ISA",schemaPath:"#/properties/ISA/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.OpcodeValue !== undefined){
const _errs3 = errors;
if(typeof data.OpcodeValue !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/OpcodeValue",schemaPath:"#/properties/OpcodeValue/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.PseudoInstructions !== undefined){
const _errs5 = errors;
if(typeof data.PseudoInstructions !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/PseudoInstructions",schemaPath:"#/properties/PseudoInstructions/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Simplified !== undefined){
const _errs7 = errors;
if(typeof data.Simplified !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/Simplified",schemaPath:"#/properties/Simplified/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
