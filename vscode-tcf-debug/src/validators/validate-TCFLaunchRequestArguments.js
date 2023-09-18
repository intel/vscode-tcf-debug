"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"__restart":{"description":"Arbitrary data from the previous, restarted session.\nThe data is sent as the `restart` attribute of the `terminated` event.\nThe client should leave the data intact."},"breakpointPrefix":{"type":"string"},"debugTCFMessages":{"type":"boolean"},"host":{"type":"string"},"noDebug":{"description":"If true, the launch request should launch the program without enabling debugging.","type":"boolean"},"pathMapper":{"type":"string"},"playback":{"type":"string"},"port":{"type":"number"},"record":{"type":"string"},"timeout":{"type":"number"}},"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.breakpointPrefix !== undefined){
const _errs1 = errors;
if(typeof data.breakpointPrefix !== "string"){
validate20.errors = [{instancePath:instancePath+"/breakpointPrefix",schemaPath:"#/properties/breakpointPrefix/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.debugTCFMessages !== undefined){
const _errs3 = errors;
if(typeof data.debugTCFMessages !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/debugTCFMessages",schemaPath:"#/properties/debugTCFMessages/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.host !== undefined){
const _errs5 = errors;
if(typeof data.host !== "string"){
validate20.errors = [{instancePath:instancePath+"/host",schemaPath:"#/properties/host/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.noDebug !== undefined){
const _errs7 = errors;
if(typeof data.noDebug !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/noDebug",schemaPath:"#/properties/noDebug/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.pathMapper !== undefined){
const _errs9 = errors;
if(typeof data.pathMapper !== "string"){
validate20.errors = [{instancePath:instancePath+"/pathMapper",schemaPath:"#/properties/pathMapper/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playback !== undefined){
const _errs11 = errors;
if(typeof data.playback !== "string"){
validate20.errors = [{instancePath:instancePath+"/playback",schemaPath:"#/properties/playback/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.port !== undefined){
let data6 = data.port;
const _errs13 = errors;
if(!((typeof data6 == "number") && (isFinite(data6)))){
validate20.errors = [{instancePath:instancePath+"/port",schemaPath:"#/properties/port/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.record !== undefined){
const _errs15 = errors;
if(typeof data.record !== "string"){
validate20.errors = [{instancePath:instancePath+"/record",schemaPath:"#/properties/record/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.timeout !== undefined){
let data8 = data.timeout;
const _errs17 = errors;
if(!((typeof data8 == "number") && (isFinite(data8)))){
validate20.errors = [{instancePath:instancePath+"/timeout",schemaPath:"#/properties/timeout/type",keyword:"type",params:{type: "number"},message:"must be number"}];
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
else {
validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}
