"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","definitions":{"StateData":{"properties":{"BPs":{"items":{"type":"string"},"type":"array"},"CPU":{"type":"string"},"Context":{"type":"string"},"FuncCall":{"type":"boolean"},"PCError":{"additionalProperties":true,"properties":{},"type":"object"},"Reversing":{"type":"boolean"},"Signal":{"type":"number"},"SignalDescription":{"type":"string"},"SignalName":{"type":"string"},"StateName":{"type":"string"},"StepError":{"additionalProperties":true,"properties":{},"type":"object"}},"type":"object"}},"properties":{"data":{"anyOf":[{"$ref":"#/definitions/StateData"},{"type":"null"}]},"lastStateReason":{"type":["null","string"]},"pc":{"type":"number"},"suspended":{"type":"boolean"}},"required":["data","lastStateReason","pc","suspended"],"type":"object"};
const schema23 = {"properties":{"BPs":{"items":{"type":"string"},"type":"array"},"CPU":{"type":"string"},"Context":{"type":"string"},"FuncCall":{"type":"boolean"},"PCError":{"additionalProperties":true,"properties":{},"type":"object"},"Reversing":{"type":"boolean"},"Signal":{"type":"number"},"SignalDescription":{"type":"string"},"SignalName":{"type":"string"},"StateName":{"type":"string"},"StepError":{"additionalProperties":true,"properties":{},"type":"object"}},"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.data === undefined) && (missing0 = "data")) || ((data.lastStateReason === undefined) && (missing0 = "lastStateReason"))) || ((data.pc === undefined) && (missing0 = "pc"))) || ((data.suspended === undefined) && (missing0 = "suspended"))){
validate20.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.data !== undefined){
let data0 = data.data;
const _errs1 = errors;
const _errs2 = errors;
let valid1 = false;
const _errs3 = errors;
const _errs4 = errors;
if(errors === _errs4){
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.BPs !== undefined){
let data1 = data0.BPs;
const _errs6 = errors;
if(errors === _errs6){
if(Array.isArray(data1)){
var valid4 = true;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
const _errs8 = errors;
if(typeof data1[i0] !== "string"){
const err0 = {instancePath:instancePath+"/data/BPs/" + i0,schemaPath:"#/definitions/StateData/properties/BPs/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
var valid4 = _errs8 === errors;
if(!valid4){
break;
}
}
}
else {
const err1 = {instancePath:instancePath+"/data/BPs",schemaPath:"#/definitions/StateData/properties/BPs/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var valid3 = _errs6 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.CPU !== undefined){
const _errs10 = errors;
if(typeof data0.CPU !== "string"){
const err2 = {instancePath:instancePath+"/data/CPU",schemaPath:"#/definitions/StateData/properties/CPU/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid3 = _errs10 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.Context !== undefined){
const _errs12 = errors;
if(typeof data0.Context !== "string"){
const err3 = {instancePath:instancePath+"/data/Context",schemaPath:"#/definitions/StateData/properties/Context/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var valid3 = _errs12 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.FuncCall !== undefined){
const _errs14 = errors;
if(typeof data0.FuncCall !== "boolean"){
const err4 = {instancePath:instancePath+"/data/FuncCall",schemaPath:"#/definitions/StateData/properties/FuncCall/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var valid3 = _errs14 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.PCError !== undefined){
let data6 = data0.PCError;
const _errs16 = errors;
if(errors === _errs16){
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
}
else {
const err5 = {instancePath:instancePath+"/data/PCError",schemaPath:"#/definitions/StateData/properties/PCError/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
var valid3 = _errs16 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.Reversing !== undefined){
const _errs19 = errors;
if(typeof data0.Reversing !== "boolean"){
const err6 = {instancePath:instancePath+"/data/Reversing",schemaPath:"#/definitions/StateData/properties/Reversing/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var valid3 = _errs19 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.Signal !== undefined){
let data8 = data0.Signal;
const _errs21 = errors;
if(!((typeof data8 == "number") && (isFinite(data8)))){
const err7 = {instancePath:instancePath+"/data/Signal",schemaPath:"#/definitions/StateData/properties/Signal/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var valid3 = _errs21 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.SignalDescription !== undefined){
const _errs23 = errors;
if(typeof data0.SignalDescription !== "string"){
const err8 = {instancePath:instancePath+"/data/SignalDescription",schemaPath:"#/definitions/StateData/properties/SignalDescription/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
var valid3 = _errs23 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.SignalName !== undefined){
const _errs25 = errors;
if(typeof data0.SignalName !== "string"){
const err9 = {instancePath:instancePath+"/data/SignalName",schemaPath:"#/definitions/StateData/properties/SignalName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
var valid3 = _errs25 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.StateName !== undefined){
const _errs27 = errors;
if(typeof data0.StateName !== "string"){
const err10 = {instancePath:instancePath+"/data/StateName",schemaPath:"#/definitions/StateData/properties/StateName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
var valid3 = _errs27 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.StepError !== undefined){
let data12 = data0.StepError;
const _errs29 = errors;
if(errors === _errs29){
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
}
else {
const err11 = {instancePath:instancePath+"/data/StepError",schemaPath:"#/definitions/StateData/properties/StepError/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
var valid3 = _errs29 === errors;
}
else {
var valid3 = true;
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
const err12 = {instancePath:instancePath+"/data",schemaPath:"#/definitions/StateData/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
var _valid0 = _errs3 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs32 = errors;
if(data0 !== null){
const err13 = {instancePath:instancePath+"/data",schemaPath:"#/properties/data/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
var _valid0 = _errs32 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err14 = {instancePath:instancePath+"/data",schemaPath:"#/properties/data/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
validate20.errors = vErrors;
return false;
}
else {
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.lastStateReason !== undefined){
let data13 = data.lastStateReason;
const _errs34 = errors;
if((data13 !== null) && (typeof data13 !== "string")){
validate20.errors = [{instancePath:instancePath+"/lastStateReason",schemaPath:"#/properties/lastStateReason/type",keyword:"type",params:{type: schema22.properties.lastStateReason.type},message:"must be null,string"}];
return false;
}
var valid0 = _errs34 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.pc !== undefined){
let data14 = data.pc;
const _errs36 = errors;
if(!((typeof data14 == "number") && (isFinite(data14)))){
validate20.errors = [{instancePath:instancePath+"/pc",schemaPath:"#/properties/pc/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs36 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.suspended !== undefined){
const _errs38 = errors;
if(typeof data.suspended !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/suspended",schemaPath:"#/properties/suspended/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs38 === errors;
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
