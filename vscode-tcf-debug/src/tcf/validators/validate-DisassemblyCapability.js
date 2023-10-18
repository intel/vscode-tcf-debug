"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"ISA":{"type":"string"},"OpcodeValue":{"type":"boolean"},"PseudoInstruction":{"type":"boolean"},"Simplified":{"type":"boolean"}},"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
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
if(data.PseudoInstruction !== undefined){
const _errs5 = errors;
if(typeof data.PseudoInstruction !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/PseudoInstruction",schemaPath:"#/properties/PseudoInstruction/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
else {
validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}
