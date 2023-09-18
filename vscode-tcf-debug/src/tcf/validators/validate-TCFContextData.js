"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"CPUGroup":{"type":"string"},"CanCount":{"type":"number"},"CanDetach":{"type":"boolean"},"CanResume":{"type":"number"},"CanSuspend":{"type":"boolean"},"CanTerminate":{"type":"boolean"},"HasState":{"type":"boolean"},"ID":{"type":"string"},"IsContainer":{"type":"boolean"},"Name":{"type":"string"},"ParentID":{"type":"string"},"ProcessID":{"type":"string"},"RCGroup":{"type":"string"},"RegAccessTypes":{"items":{"type":"string"},"type":"array"},"SymbolsGroup":{"type":"string"},"WordSize":{"type":"number"}},"required":["ID"],"type":"object"};

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
if(data.CPUGroup !== undefined){
const _errs1 = errors;
if(typeof data.CPUGroup !== "string"){
validate20.errors = [{instancePath:instancePath+"/CPUGroup",schemaPath:"#/properties/CPUGroup/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.CanCount !== undefined){
let data1 = data.CanCount;
const _errs3 = errors;
if(!((typeof data1 == "number") && (isFinite(data1)))){
validate20.errors = [{instancePath:instancePath+"/CanCount",schemaPath:"#/properties/CanCount/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.CanDetach !== undefined){
const _errs5 = errors;
if(typeof data.CanDetach !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/CanDetach",schemaPath:"#/properties/CanDetach/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.CanResume !== undefined){
let data3 = data.CanResume;
const _errs7 = errors;
if(!((typeof data3 == "number") && (isFinite(data3)))){
validate20.errors = [{instancePath:instancePath+"/CanResume",schemaPath:"#/properties/CanResume/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.CanSuspend !== undefined){
const _errs9 = errors;
if(typeof data.CanSuspend !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/CanSuspend",schemaPath:"#/properties/CanSuspend/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.CanTerminate !== undefined){
const _errs11 = errors;
if(typeof data.CanTerminate !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/CanTerminate",schemaPath:"#/properties/CanTerminate/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.HasState !== undefined){
const _errs13 = errors;
if(typeof data.HasState !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/HasState",schemaPath:"#/properties/HasState/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ID !== undefined){
const _errs15 = errors;
if(typeof data.ID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ID",schemaPath:"#/properties/ID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.IsContainer !== undefined){
const _errs17 = errors;
if(typeof data.IsContainer !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/IsContainer",schemaPath:"#/properties/IsContainer/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs17 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Name !== undefined){
const _errs19 = errors;
if(typeof data.Name !== "string"){
validate20.errors = [{instancePath:instancePath+"/Name",schemaPath:"#/properties/Name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs19 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ParentID !== undefined){
const _errs21 = errors;
if(typeof data.ParentID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ParentID",schemaPath:"#/properties/ParentID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs21 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ProcessID !== undefined){
const _errs23 = errors;
if(typeof data.ProcessID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ProcessID",schemaPath:"#/properties/ProcessID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs23 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.RCGroup !== undefined){
const _errs25 = errors;
if(typeof data.RCGroup !== "string"){
validate20.errors = [{instancePath:instancePath+"/RCGroup",schemaPath:"#/properties/RCGroup/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.RegAccessTypes !== undefined){
let data13 = data.RegAccessTypes;
const _errs27 = errors;
if(errors === _errs27){
if(Array.isArray(data13)){
var valid1 = true;
const len0 = data13.length;
for(let i0=0; i0<len0; i0++){
const _errs29 = errors;
if(typeof data13[i0] !== "string"){
validate20.errors = [{instancePath:instancePath+"/RegAccessTypes/" + i0,schemaPath:"#/properties/RegAccessTypes/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs29 === errors;
if(!valid1){
break;
}
}
}
else {
validate20.errors = [{instancePath:instancePath+"/RegAccessTypes",schemaPath:"#/properties/RegAccessTypes/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs27 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.SymbolsGroup !== undefined){
const _errs31 = errors;
if(typeof data.SymbolsGroup !== "string"){
validate20.errors = [{instancePath:instancePath+"/SymbolsGroup",schemaPath:"#/properties/SymbolsGroup/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs31 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.WordSize !== undefined){
let data16 = data.WordSize;
const _errs33 = errors;
if(!((typeof data16 == "number") && (isFinite(data16)))){
validate20.errors = [{instancePath:instancePath+"/WordSize",schemaPath:"#/properties/WordSize/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs33 === errors;
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
