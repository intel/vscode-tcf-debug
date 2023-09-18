"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","definitions":{"PieceValue":{"properties":{"Size":{"type":"number"},"Value":{"type":"string"}},"required":["Size"],"type":"object"}},"properties":{"Address":{"type":"number"},"BigEndian":{"type":"boolean"},"BinaryScale":{"type":"number"},"BitStride":{"type":"number"},"Class":{"enum":[0,1,2,3,4,5,6,7,8,9],"type":"number"},"DecimalScale":{"type":"number"},"ImplicitPointer":{"type":"boolean"},"Pieces":{"items":{"$ref":"#/definitions/PieceValue"},"type":"array"},"Register":{"type":"string"},"Symbol":{"type":"string"},"Type":{"type":"string"}},"type":"object"};
const schema23 = {"properties":{"Size":{"type":"number"},"Value":{"type":"string"}},"required":["Size"],"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.Address !== undefined){
let data0 = data.Address;
const _errs1 = errors;
if(!((typeof data0 == "number") && (isFinite(data0)))){
validate20.errors = [{instancePath:instancePath+"/Address",schemaPath:"#/properties/Address/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.BigEndian !== undefined){
const _errs3 = errors;
if(typeof data.BigEndian !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/BigEndian",schemaPath:"#/properties/BigEndian/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.BinaryScale !== undefined){
let data2 = data.BinaryScale;
const _errs5 = errors;
if(!((typeof data2 == "number") && (isFinite(data2)))){
validate20.errors = [{instancePath:instancePath+"/BinaryScale",schemaPath:"#/properties/BinaryScale/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.BitStride !== undefined){
let data3 = data.BitStride;
const _errs7 = errors;
if(!((typeof data3 == "number") && (isFinite(data3)))){
validate20.errors = [{instancePath:instancePath+"/BitStride",schemaPath:"#/properties/BitStride/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Class !== undefined){
let data4 = data.Class;
const _errs9 = errors;
if(!((typeof data4 == "number") && (isFinite(data4)))){
validate20.errors = [{instancePath:instancePath+"/Class",schemaPath:"#/properties/Class/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
if(!((((((((((data4 === 0) || (data4 === 1)) || (data4 === 2)) || (data4 === 3)) || (data4 === 4)) || (data4 === 5)) || (data4 === 6)) || (data4 === 7)) || (data4 === 8)) || (data4 === 9))){
validate20.errors = [{instancePath:instancePath+"/Class",schemaPath:"#/properties/Class/enum",keyword:"enum",params:{allowedValues: schema22.properties.Class.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.DecimalScale !== undefined){
let data5 = data.DecimalScale;
const _errs11 = errors;
if(!((typeof data5 == "number") && (isFinite(data5)))){
validate20.errors = [{instancePath:instancePath+"/DecimalScale",schemaPath:"#/properties/DecimalScale/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ImplicitPointer !== undefined){
const _errs13 = errors;
if(typeof data.ImplicitPointer !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/ImplicitPointer",schemaPath:"#/properties/ImplicitPointer/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Pieces !== undefined){
let data7 = data.Pieces;
const _errs15 = errors;
if(errors === _errs15){
if(Array.isArray(data7)){
var valid1 = true;
const len0 = data7.length;
for(let i0=0; i0<len0; i0++){
let data8 = data7[i0];
const _errs17 = errors;
const _errs18 = errors;
if(errors === _errs18){
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
let missing0;
if((data8.Size === undefined) && (missing0 = "Size")){
validate20.errors = [{instancePath:instancePath+"/Pieces/" + i0,schemaPath:"#/definitions/PieceValue/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data8.Size !== undefined){
let data9 = data8.Size;
const _errs20 = errors;
if(!((typeof data9 == "number") && (isFinite(data9)))){
validate20.errors = [{instancePath:instancePath+"/Pieces/" + i0+"/Size",schemaPath:"#/definitions/PieceValue/properties/Size/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid3 = _errs20 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data8.Value !== undefined){
const _errs22 = errors;
if(typeof data8.Value !== "string"){
validate20.errors = [{instancePath:instancePath+"/Pieces/" + i0+"/Value",schemaPath:"#/definitions/PieceValue/properties/Value/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid3 = _errs22 === errors;
}
else {
var valid3 = true;
}
}
}
}
else {
validate20.errors = [{instancePath:instancePath+"/Pieces/" + i0,schemaPath:"#/definitions/PieceValue/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid1 = _errs17 === errors;
if(!valid1){
break;
}
}
}
else {
validate20.errors = [{instancePath:instancePath+"/Pieces",schemaPath:"#/properties/Pieces/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Register !== undefined){
const _errs24 = errors;
if(typeof data.Register !== "string"){
validate20.errors = [{instancePath:instancePath+"/Register",schemaPath:"#/properties/Register/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Symbol !== undefined){
const _errs26 = errors;
if(typeof data.Symbol !== "string"){
validate20.errors = [{instancePath:instancePath+"/Symbol",schemaPath:"#/properties/Symbol/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs26 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Type !== undefined){
const _errs28 = errors;
if(typeof data.Type !== "string"){
validate20.errors = [{instancePath:instancePath+"/Type",schemaPath:"#/properties/Type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs28 === errors;
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
else {
validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}
