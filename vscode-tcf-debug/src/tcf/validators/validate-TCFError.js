"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$ref":"#/definitions/TCFError","$schema":"http://json-schema.org/draft-07/schema#","definitions":{"TCFError":{"properties":{"AltCode":{"type":"number"},"AltOrg":{"type":"string"},"CausedBy":{"$ref":"#/definitions/TCFError"},"Code":{"type":"number"},"Format":{"type":"string"},"Params":{"items":{},"type":"array"},"Service":{"type":"string"},"Severity":{"type":"number"},"Time":{"type":"number"}},"required":["Code"],"type":"object"}}};
const schema23 = {"properties":{"AltCode":{"type":"number"},"AltOrg":{"type":"string"},"CausedBy":{"$ref":"#/definitions/TCFError"},"Code":{"type":"number"},"Format":{"type":"string"},"Params":{"items":{},"type":"array"},"Service":{"type":"string"},"Severity":{"type":"number"},"Time":{"type":"number"}},"required":["Code"],"type":"object"};
const wrapper0 = {validate: validate21};

function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.Code === undefined) && (missing0 = "Code")){
validate21.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.AltCode !== undefined){
let data0 = data.AltCode;
const _errs1 = errors;
if(!((typeof data0 == "number") && (isFinite(data0)))){
validate21.errors = [{instancePath:instancePath+"/AltCode",schemaPath:"#/properties/AltCode/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.AltOrg !== undefined){
const _errs3 = errors;
if(typeof data.AltOrg !== "string"){
validate21.errors = [{instancePath:instancePath+"/AltOrg",schemaPath:"#/properties/AltOrg/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.CausedBy !== undefined){
const _errs5 = errors;
if(!(wrapper0.validate(data.CausedBy, {instancePath:instancePath+"/CausedBy",parentData:data,parentDataProperty:"CausedBy",rootData}))){
vErrors = wrapper0.validate.errors;
errors = vErrors.length;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Code !== undefined){
let data3 = data.Code;
const _errs6 = errors;
if(!((typeof data3 == "number") && (isFinite(data3)))){
validate21.errors = [{instancePath:instancePath+"/Code",schemaPath:"#/properties/Code/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Format !== undefined){
const _errs8 = errors;
if(typeof data.Format !== "string"){
validate21.errors = [{instancePath:instancePath+"/Format",schemaPath:"#/properties/Format/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Params !== undefined){
const _errs10 = errors;
if(errors === _errs10){
if(!(Array.isArray(data.Params))){
validate21.errors = [{instancePath:instancePath+"/Params",schemaPath:"#/properties/Params/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Service !== undefined){
const _errs12 = errors;
if(typeof data.Service !== "string"){
validate21.errors = [{instancePath:instancePath+"/Service",schemaPath:"#/properties/Service/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Severity !== undefined){
let data7 = data.Severity;
const _errs14 = errors;
if(!((typeof data7 == "number") && (isFinite(data7)))){
validate21.errors = [{instancePath:instancePath+"/Severity",schemaPath:"#/properties/Severity/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Time !== undefined){
let data8 = data.Time;
const _errs16 = errors;
if(!((typeof data8 == "number") && (isFinite(data8)))){
validate21.errors = [{instancePath:instancePath+"/Time",schemaPath:"#/properties/Time/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs16 === errors;
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
validate21.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate21.errors = vErrors;
return errors === 0;
}


function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(!(validate21(data, {instancePath,parentData,parentDataProperty,rootData}))){
vErrors = validate21.errors;
errors = vErrors.length;
}
validate20.errors = vErrors;
return errors === 0;
}
