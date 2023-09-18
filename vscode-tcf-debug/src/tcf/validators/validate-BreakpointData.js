"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"BreakpointType":{"enum":["Auto","Hardware","Software"],"type":"string"},"Enabled":{"type":"boolean"},"File":{"type":"string"},"ID":{"type":"string"},"Line":{"type":"number"}},"required":["Enabled","ID"],"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.Enabled === undefined) && (missing0 = "Enabled")) || ((data.ID === undefined) && (missing0 = "ID"))){
validate20.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.BreakpointType !== undefined){
let data0 = data.BreakpointType;
const _errs1 = errors;
if(typeof data0 !== "string"){
validate20.errors = [{instancePath:instancePath+"/BreakpointType",schemaPath:"#/properties/BreakpointType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data0 === "Auto") || (data0 === "Hardware")) || (data0 === "Software"))){
validate20.errors = [{instancePath:instancePath+"/BreakpointType",schemaPath:"#/properties/BreakpointType/enum",keyword:"enum",params:{allowedValues: schema22.properties.BreakpointType.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Enabled !== undefined){
const _errs3 = errors;
if(typeof data.Enabled !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/Enabled",schemaPath:"#/properties/Enabled/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.File !== undefined){
const _errs5 = errors;
if(typeof data.File !== "string"){
validate20.errors = [{instancePath:instancePath+"/File",schemaPath:"#/properties/File/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ID !== undefined){
const _errs7 = errors;
if(typeof data.ID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ID",schemaPath:"#/properties/ID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Line !== undefined){
let data4 = data.Line;
const _errs9 = errors;
if(!((typeof data4 == "number") && (isFinite(data4)))){
validate20.errors = [{instancePath:instancePath+"/Line",schemaPath:"#/properties/Line/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
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
