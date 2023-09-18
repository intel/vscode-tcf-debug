"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"Address":{"type":["string","number"]},"BreakpointType":{"type":"string"},"ConditionError":{"type":"string"},"Error":{"type":"string"},"HitCount":{"type":"number"},"LocationContext":{"type":"string"},"MemoryContext":{"type":"string"},"Size":{"type":"number"}},"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.Address !== undefined){
let data0 = data.Address;
const _errs1 = errors;
if((typeof data0 !== "string") && (!((typeof data0 == "number") && (isFinite(data0))))){
validate20.errors = [{instancePath:instancePath+"/Address",schemaPath:"#/properties/Address/type",keyword:"type",params:{type: schema22.properties.Address.type},message:"must be string,number"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.BreakpointType !== undefined){
const _errs3 = errors;
if(typeof data.BreakpointType !== "string"){
validate20.errors = [{instancePath:instancePath+"/BreakpointType",schemaPath:"#/properties/BreakpointType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ConditionError !== undefined){
const _errs5 = errors;
if(typeof data.ConditionError !== "string"){
validate20.errors = [{instancePath:instancePath+"/ConditionError",schemaPath:"#/properties/ConditionError/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Error !== undefined){
const _errs7 = errors;
if(typeof data.Error !== "string"){
validate20.errors = [{instancePath:instancePath+"/Error",schemaPath:"#/properties/Error/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.HitCount !== undefined){
let data4 = data.HitCount;
const _errs9 = errors;
if(!((typeof data4 == "number") && (isFinite(data4)))){
validate20.errors = [{instancePath:instancePath+"/HitCount",schemaPath:"#/properties/HitCount/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.LocationContext !== undefined){
const _errs11 = errors;
if(typeof data.LocationContext !== "string"){
validate20.errors = [{instancePath:instancePath+"/LocationContext",schemaPath:"#/properties/LocationContext/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.MemoryContext !== undefined){
const _errs13 = errors;
if(typeof data.MemoryContext !== "string"){
validate20.errors = [{instancePath:instancePath+"/MemoryContext",schemaPath:"#/properties/MemoryContext/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Size !== undefined){
let data7 = data.Size;
const _errs15 = errors;
if(!((typeof data7 == "number") && (isFinite(data7)))){
validate20.errors = [{instancePath:instancePath+"/Size",schemaPath:"#/properties/Size/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs15 === errors;
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
else {
validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}
