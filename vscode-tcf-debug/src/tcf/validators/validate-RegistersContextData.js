"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"Description":{"type":"string"},"ID":{"type":"string"},"Name":{"type":"string"},"ParentID":{"type":"string"},"ProcessID":{"type":"string"},"ReadOnce":{"type":"boolean"},"Readable":{"type":"boolean"},"Role":{"type":"string"},"Size":{"type":"number"}},"required":["ID"],"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.ID === undefined) && (missing0 = "ID")){
validate20.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.Description !== undefined){
const _errs1 = errors;
if(typeof data.Description !== "string"){
validate20.errors = [{instancePath:instancePath+"/Description",schemaPath:"#/properties/Description/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ID !== undefined){
const _errs3 = errors;
if(typeof data.ID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ID",schemaPath:"#/properties/ID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Name !== undefined){
const _errs5 = errors;
if(typeof data.Name !== "string"){
validate20.errors = [{instancePath:instancePath+"/Name",schemaPath:"#/properties/Name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ParentID !== undefined){
const _errs7 = errors;
if(typeof data.ParentID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ParentID",schemaPath:"#/properties/ParentID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ProcessID !== undefined){
const _errs9 = errors;
if(typeof data.ProcessID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ProcessID",schemaPath:"#/properties/ProcessID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ReadOnce !== undefined){
const _errs11 = errors;
if(typeof data.ReadOnce !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/ReadOnce",schemaPath:"#/properties/ReadOnce/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Readable !== undefined){
const _errs13 = errors;
if(typeof data.Readable !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/Readable",schemaPath:"#/properties/Readable/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Role !== undefined){
const _errs15 = errors;
if(typeof data.Role !== "string"){
validate20.errors = [{instancePath:instancePath+"/Role",schemaPath:"#/properties/Role/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Size !== undefined){
let data8 = data.Size;
const _errs17 = errors;
if(!((typeof data8 == "number") && (isFinite(data8)))){
validate20.errors = [{instancePath:instancePath+"/Size",schemaPath:"#/properties/Size/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs17 === errors;
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
