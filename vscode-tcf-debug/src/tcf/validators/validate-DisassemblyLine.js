"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","definitions":{"DisassemblyInstructionField":{"properties":{"AddressSpace":{"type":"string"},"Text":{"type":"string"},"Type":{"type":"string"},"Value":{"type":"number"}},"required":["Text","Type"],"type":"object"}},"properties":{"Address":{"type":"number"},"ISA":{"type":"string"},"Instruction":{"anyOf":[{"items":{"$ref":"#/definitions/DisassemblyInstructionField"},"type":"array"},{"type":"null"}]},"OpcodeValue":{"type":"string"},"Size":{"type":"number"}},"required":["Address","Instruction","Size"],"type":"object"};
const schema23 = {"properties":{"AddressSpace":{"type":"string"},"Text":{"type":"string"},"Type":{"type":"string"},"Value":{"type":"number"}},"required":["Text","Type"],"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.Address === undefined) && (missing0 = "Address")) || ((data.Instruction === undefined) && (missing0 = "Instruction"))) || ((data.Size === undefined) && (missing0 = "Size"))){
validate20.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
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
if(data.ISA !== undefined){
const _errs3 = errors;
if(typeof data.ISA !== "string"){
validate20.errors = [{instancePath:instancePath+"/ISA",schemaPath:"#/properties/ISA/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Instruction !== undefined){
let data2 = data.Instruction;
const _errs5 = errors;
const _errs6 = errors;
let valid1 = false;
const _errs7 = errors;
if(errors === _errs7){
if(Array.isArray(data2)){
var valid2 = true;
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
const _errs9 = errors;
const _errs10 = errors;
if(errors === _errs10){
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
let missing1;
if(((data3.Text === undefined) && (missing1 = "Text")) || ((data3.Type === undefined) && (missing1 = "Type"))){
const err0 = {instancePath:instancePath+"/Instruction/" + i0,schemaPath:"#/definitions/DisassemblyInstructionField/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data3.AddressSpace !== undefined){
const _errs12 = errors;
if(typeof data3.AddressSpace !== "string"){
const err1 = {instancePath:instancePath+"/Instruction/" + i0+"/AddressSpace",schemaPath:"#/definitions/DisassemblyInstructionField/properties/AddressSpace/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
var valid4 = _errs12 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data3.Text !== undefined){
const _errs14 = errors;
if(typeof data3.Text !== "string"){
const err2 = {instancePath:instancePath+"/Instruction/" + i0+"/Text",schemaPath:"#/definitions/DisassemblyInstructionField/properties/Text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid4 = _errs14 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data3.Type !== undefined){
const _errs16 = errors;
if(typeof data3.Type !== "string"){
const err3 = {instancePath:instancePath+"/Instruction/" + i0+"/Type",schemaPath:"#/definitions/DisassemblyInstructionField/properties/Type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var valid4 = _errs16 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data3.Value !== undefined){
let data7 = data3.Value;
const _errs18 = errors;
if(!((typeof data7 == "number") && (isFinite(data7)))){
const err4 = {instancePath:instancePath+"/Instruction/" + i0+"/Value",schemaPath:"#/definitions/DisassemblyInstructionField/properties/Value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var valid4 = _errs18 === errors;
}
else {
var valid4 = true;
}
}
}
}
}
}
else {
const err5 = {instancePath:instancePath+"/Instruction/" + i0,schemaPath:"#/definitions/DisassemblyInstructionField/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
var valid2 = _errs9 === errors;
if(!valid2){
break;
}
}
}
else {
const err6 = {instancePath:instancePath+"/Instruction",schemaPath:"#/properties/Instruction/anyOf/0/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
var _valid0 = _errs7 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs20 = errors;
if(data2 !== null){
const err7 = {instancePath:instancePath+"/Instruction",schemaPath:"#/properties/Instruction/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var _valid0 = _errs20 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err8 = {instancePath:instancePath+"/Instruction",schemaPath:"#/properties/Instruction/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
validate20.errors = vErrors;
return false;
}
else {
errors = _errs6;
if(vErrors !== null){
if(_errs6){
vErrors.length = _errs6;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.OpcodeValue !== undefined){
const _errs22 = errors;
if(typeof data.OpcodeValue !== "string"){
validate20.errors = [{instancePath:instancePath+"/OpcodeValue",schemaPath:"#/properties/OpcodeValue/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Size !== undefined){
let data9 = data.Size;
const _errs24 = errors;
if(!((typeof data9 == "number") && (isFinite(data9)))){
validate20.errors = [{instancePath:instancePath+"/Size",schemaPath:"#/properties/Size/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs24 === errors;
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
else {
validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}
