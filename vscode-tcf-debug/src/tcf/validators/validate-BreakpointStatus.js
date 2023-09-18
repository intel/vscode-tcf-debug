"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","definitions":{"InstanceStatusData":{"properties":{"Address":{"type":["string","number"]},"BreakpointType":{"type":"string"},"ConditionError":{"type":"string"},"Error":{"type":"string"},"HitCount":{"type":"number"},"LocationContext":{"type":"string"},"MemoryContext":{"type":"string"},"Size":{"type":"number"}},"type":"object"}},"properties":{"Column":{"type":"number"},"Error":{"type":"string"},"File":{"type":"string"},"Instances":{"anyOf":[{"items":{"$ref":"#/definitions/InstanceStatusData"},"type":"array"},{"type":"null"}]},"Line":{"type":"number"}},"type":"object"};
const schema23 = {"properties":{"Address":{"type":["string","number"]},"BreakpointType":{"type":"string"},"ConditionError":{"type":"string"},"Error":{"type":"string"},"HitCount":{"type":"number"},"LocationContext":{"type":"string"},"MemoryContext":{"type":"string"},"Size":{"type":"number"}},"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.Column !== undefined){
let data0 = data.Column;
const _errs1 = errors;
if(!((typeof data0 == "number") && (isFinite(data0)))){
validate20.errors = [{instancePath:instancePath+"/Column",schemaPath:"#/properties/Column/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Error !== undefined){
const _errs3 = errors;
if(typeof data.Error !== "string"){
validate20.errors = [{instancePath:instancePath+"/Error",schemaPath:"#/properties/Error/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
if(data.Instances !== undefined){
let data3 = data.Instances;
const _errs7 = errors;
const _errs8 = errors;
let valid1 = false;
const _errs9 = errors;
if(errors === _errs9){
if(Array.isArray(data3)){
var valid2 = true;
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
let data4 = data3[i0];
const _errs11 = errors;
const _errs12 = errors;
if(errors === _errs12){
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
if(data4.Address !== undefined){
let data5 = data4.Address;
const _errs14 = errors;
if((typeof data5 !== "string") && (!((typeof data5 == "number") && (isFinite(data5))))){
const err0 = {instancePath:instancePath+"/Instances/" + i0+"/Address",schemaPath:"#/definitions/InstanceStatusData/properties/Address/type",keyword:"type",params:{type: schema23.properties.Address.type},message:"must be string,number"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
var valid4 = _errs14 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data4.BreakpointType !== undefined){
const _errs16 = errors;
if(typeof data4.BreakpointType !== "string"){
const err1 = {instancePath:instancePath+"/Instances/" + i0+"/BreakpointType",schemaPath:"#/definitions/InstanceStatusData/properties/BreakpointType/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
var valid4 = _errs16 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data4.ConditionError !== undefined){
const _errs18 = errors;
if(typeof data4.ConditionError !== "string"){
const err2 = {instancePath:instancePath+"/Instances/" + i0+"/ConditionError",schemaPath:"#/definitions/InstanceStatusData/properties/ConditionError/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid4 = _errs18 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data4.Error !== undefined){
const _errs20 = errors;
if(typeof data4.Error !== "string"){
const err3 = {instancePath:instancePath+"/Instances/" + i0+"/Error",schemaPath:"#/definitions/InstanceStatusData/properties/Error/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var valid4 = _errs20 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data4.HitCount !== undefined){
let data9 = data4.HitCount;
const _errs22 = errors;
if(!((typeof data9 == "number") && (isFinite(data9)))){
const err4 = {instancePath:instancePath+"/Instances/" + i0+"/HitCount",schemaPath:"#/definitions/InstanceStatusData/properties/HitCount/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var valid4 = _errs22 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data4.LocationContext !== undefined){
const _errs24 = errors;
if(typeof data4.LocationContext !== "string"){
const err5 = {instancePath:instancePath+"/Instances/" + i0+"/LocationContext",schemaPath:"#/definitions/InstanceStatusData/properties/LocationContext/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var valid4 = _errs24 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data4.MemoryContext !== undefined){
const _errs26 = errors;
if(typeof data4.MemoryContext !== "string"){
const err6 = {instancePath:instancePath+"/Instances/" + i0+"/MemoryContext",schemaPath:"#/definitions/InstanceStatusData/properties/MemoryContext/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var valid4 = _errs26 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data4.Size !== undefined){
let data12 = data4.Size;
const _errs28 = errors;
if(!((typeof data12 == "number") && (isFinite(data12)))){
const err7 = {instancePath:instancePath+"/Instances/" + i0+"/Size",schemaPath:"#/definitions/InstanceStatusData/properties/Size/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var valid4 = _errs28 === errors;
}
else {
var valid4 = true;
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
const err8 = {instancePath:instancePath+"/Instances/" + i0,schemaPath:"#/definitions/InstanceStatusData/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
var valid2 = _errs11 === errors;
if(!valid2){
break;
}
}
}
else {
const err9 = {instancePath:instancePath+"/Instances",schemaPath:"#/properties/Instances/anyOf/0/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
var _valid0 = _errs9 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs30 = errors;
if(data3 !== null){
const err10 = {instancePath:instancePath+"/Instances",schemaPath:"#/properties/Instances/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
var _valid0 = _errs30 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err11 = {instancePath:instancePath+"/Instances",schemaPath:"#/properties/Instances/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
validate20.errors = vErrors;
return false;
}
else {
errors = _errs8;
if(vErrors !== null){
if(_errs8){
vErrors.length = _errs8;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Line !== undefined){
let data13 = data.Line;
const _errs32 = errors;
if(!((typeof data13 == "number") && (isFinite(data13)))){
validate20.errors = [{instancePath:instancePath+"/Line",schemaPath:"#/properties/Line/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs32 === errors;
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
