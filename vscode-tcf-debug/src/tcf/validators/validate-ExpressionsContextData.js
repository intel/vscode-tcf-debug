"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"CanAssign":{"type":"boolean"},"Class":{"type":"number"},"Expression":{"type":"string"},"HasFuncCall":{"type":"boolean"},"ID":{"type":"string"},"ParentID":{"type":"string"},"Size":{"type":"number"},"SymbolID":{"type":"string"},"Type":{"type":"string"}},"required":["ID"],"type":"object"};

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
if(data.CanAssign !== undefined){
const _errs1 = errors;
if(typeof data.CanAssign !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/CanAssign",schemaPath:"#/properties/CanAssign/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Class !== undefined){
let data1 = data.Class;
const _errs3 = errors;
if(!((typeof data1 == "number") && (isFinite(data1)))){
validate20.errors = [{instancePath:instancePath+"/Class",schemaPath:"#/properties/Class/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Expression !== undefined){
const _errs5 = errors;
if(typeof data.Expression !== "string"){
validate20.errors = [{instancePath:instancePath+"/Expression",schemaPath:"#/properties/Expression/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.HasFuncCall !== undefined){
const _errs7 = errors;
if(typeof data.HasFuncCall !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/HasFuncCall",schemaPath:"#/properties/HasFuncCall/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ID !== undefined){
const _errs9 = errors;
if(typeof data.ID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ID",schemaPath:"#/properties/ID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ParentID !== undefined){
const _errs11 = errors;
if(typeof data.ParentID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ParentID",schemaPath:"#/properties/ParentID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Size !== undefined){
let data6 = data.Size;
const _errs13 = errors;
if(!((typeof data6 == "number") && (isFinite(data6)))){
validate20.errors = [{instancePath:instancePath+"/Size",schemaPath:"#/properties/Size/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.SymbolID !== undefined){
const _errs15 = errors;
if(typeof data.SymbolID !== "string"){
validate20.errors = [{instancePath:instancePath+"/SymbolID",schemaPath:"#/properties/SymbolID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Type !== undefined){
const _errs17 = errors;
if(typeof data.Type !== "string"){
validate20.errors = [{instancePath:instancePath+"/Type",schemaPath:"#/properties/Type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
