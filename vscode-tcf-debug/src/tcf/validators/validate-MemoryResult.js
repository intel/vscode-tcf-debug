"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","definitions":{"MemoryErrorAddress":{"properties":{"addr":{"type":"number"},"msg":{},"size":{"type":"number"},"stat":{"type":"number"}},"required":["addr","msg","size","stat"],"type":"object"}},"properties":{"base64":{"type":"string"},"errorAddresses":{"anyOf":[{"items":{"$ref":"#/definitions/MemoryErrorAddress"},"type":"array"},{"type":"null"}]}},"required":["base64","errorAddresses"],"type":"object"};
const schema23 = {"properties":{"addr":{"type":"number"},"msg":{},"size":{"type":"number"},"stat":{"type":"number"}},"required":["addr","msg","size","stat"],"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.base64 === undefined) && (missing0 = "base64")) || ((data.errorAddresses === undefined) && (missing0 = "errorAddresses"))){
validate20.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.base64 !== undefined){
const _errs1 = errors;
if(typeof data.base64 !== "string"){
validate20.errors = [{instancePath:instancePath+"/base64",schemaPath:"#/properties/base64/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.errorAddresses !== undefined){
let data1 = data.errorAddresses;
const _errs3 = errors;
const _errs4 = errors;
let valid1 = false;
const _errs5 = errors;
if(errors === _errs5){
if(Array.isArray(data1)){
var valid2 = true;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
const _errs7 = errors;
const _errs8 = errors;
if(errors === _errs8){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
let missing1;
if(((((data2.addr === undefined) && (missing1 = "addr")) || ((data2.msg === undefined) && (missing1 = "msg"))) || ((data2.size === undefined) && (missing1 = "size"))) || ((data2.stat === undefined) && (missing1 = "stat"))){
const err0 = {instancePath:instancePath+"/errorAddresses/" + i0,schemaPath:"#/definitions/MemoryErrorAddress/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data2.addr !== undefined){
let data3 = data2.addr;
const _errs10 = errors;
if(!((typeof data3 == "number") && (isFinite(data3)))){
const err1 = {instancePath:instancePath+"/errorAddresses/" + i0+"/addr",schemaPath:"#/definitions/MemoryErrorAddress/properties/addr/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
var valid4 = _errs10 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data2.size !== undefined){
let data4 = data2.size;
const _errs12 = errors;
if(!((typeof data4 == "number") && (isFinite(data4)))){
const err2 = {instancePath:instancePath+"/errorAddresses/" + i0+"/size",schemaPath:"#/definitions/MemoryErrorAddress/properties/size/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid4 = _errs12 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data2.stat !== undefined){
let data5 = data2.stat;
const _errs14 = errors;
if(!((typeof data5 == "number") && (isFinite(data5)))){
const err3 = {instancePath:instancePath+"/errorAddresses/" + i0+"/stat",schemaPath:"#/definitions/MemoryErrorAddress/properties/stat/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var valid4 = _errs14 === errors;
}
else {
var valid4 = true;
}
}
}
}
}
else {
const err4 = {instancePath:instancePath+"/errorAddresses/" + i0,schemaPath:"#/definitions/MemoryErrorAddress/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var valid2 = _errs7 === errors;
if(!valid2){
break;
}
}
}
else {
const err5 = {instancePath:instancePath+"/errorAddresses",schemaPath:"#/properties/errorAddresses/anyOf/0/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs16 = errors;
if(data1 !== null){
const err6 = {instancePath:instancePath+"/errorAddresses",schemaPath:"#/properties/errorAddresses/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var _valid0 = _errs16 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err7 = {instancePath:instancePath+"/errorAddresses",schemaPath:"#/properties/errorAddresses/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
validate20.errors = vErrors;
return false;
}
else {
errors = _errs4;
if(vErrors !== null){
if(_errs4){
vErrors.length = _errs4;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
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
