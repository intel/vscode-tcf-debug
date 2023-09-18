"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"BasicBlock":{"type":"boolean"},"Dir":{"type":"string"},"Discriminator":{"type":"number"},"EAddr":{"type":"number"},"ECol":{"type":"number"},"ELine":{"type":"number"},"EpilogueBegin":{"type":"boolean"},"File":{"type":"string"},"ISA":{"type":"number"},"IsStmt":{"type":"boolean"},"NAddr":{"type":"number"},"NStmtAddr":{"type":"number"},"OpIndex":{"type":"number"},"PrologueEnd":{"type":"boolean"},"SAddr":{"type":"number"},"SCol":{"type":"number"},"SLine":{"type":"number"}},"type":"object"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.BasicBlock !== undefined){
const _errs1 = errors;
if(typeof data.BasicBlock !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/BasicBlock",schemaPath:"#/properties/BasicBlock/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Dir !== undefined){
const _errs3 = errors;
if(typeof data.Dir !== "string"){
validate20.errors = [{instancePath:instancePath+"/Dir",schemaPath:"#/properties/Dir/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Discriminator !== undefined){
let data2 = data.Discriminator;
const _errs5 = errors;
if(!((typeof data2 == "number") && (isFinite(data2)))){
validate20.errors = [{instancePath:instancePath+"/Discriminator",schemaPath:"#/properties/Discriminator/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.EAddr !== undefined){
let data3 = data.EAddr;
const _errs7 = errors;
if(!((typeof data3 == "number") && (isFinite(data3)))){
validate20.errors = [{instancePath:instancePath+"/EAddr",schemaPath:"#/properties/EAddr/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ECol !== undefined){
let data4 = data.ECol;
const _errs9 = errors;
if(!((typeof data4 == "number") && (isFinite(data4)))){
validate20.errors = [{instancePath:instancePath+"/ECol",schemaPath:"#/properties/ECol/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ELine !== undefined){
let data5 = data.ELine;
const _errs11 = errors;
if(!((typeof data5 == "number") && (isFinite(data5)))){
validate20.errors = [{instancePath:instancePath+"/ELine",schemaPath:"#/properties/ELine/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.EpilogueBegin !== undefined){
const _errs13 = errors;
if(typeof data.EpilogueBegin !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/EpilogueBegin",schemaPath:"#/properties/EpilogueBegin/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.File !== undefined){
const _errs15 = errors;
if(typeof data.File !== "string"){
validate20.errors = [{instancePath:instancePath+"/File",schemaPath:"#/properties/File/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ISA !== undefined){
let data8 = data.ISA;
const _errs17 = errors;
if(!((typeof data8 == "number") && (isFinite(data8)))){
validate20.errors = [{instancePath:instancePath+"/ISA",schemaPath:"#/properties/ISA/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs17 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.IsStmt !== undefined){
const _errs19 = errors;
if(typeof data.IsStmt !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/IsStmt",schemaPath:"#/properties/IsStmt/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs19 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.NAddr !== undefined){
let data10 = data.NAddr;
const _errs21 = errors;
if(!((typeof data10 == "number") && (isFinite(data10)))){
validate20.errors = [{instancePath:instancePath+"/NAddr",schemaPath:"#/properties/NAddr/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs21 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.NStmtAddr !== undefined){
let data11 = data.NStmtAddr;
const _errs23 = errors;
if(!((typeof data11 == "number") && (isFinite(data11)))){
validate20.errors = [{instancePath:instancePath+"/NStmtAddr",schemaPath:"#/properties/NStmtAddr/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs23 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.OpIndex !== undefined){
let data12 = data.OpIndex;
const _errs25 = errors;
if(!((typeof data12 == "number") && (isFinite(data12)))){
validate20.errors = [{instancePath:instancePath+"/OpIndex",schemaPath:"#/properties/OpIndex/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.PrologueEnd !== undefined){
const _errs27 = errors;
if(typeof data.PrologueEnd !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/PrologueEnd",schemaPath:"#/properties/PrologueEnd/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs27 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.SAddr !== undefined){
let data14 = data.SAddr;
const _errs29 = errors;
if(!((typeof data14 == "number") && (isFinite(data14)))){
validate20.errors = [{instancePath:instancePath+"/SAddr",schemaPath:"#/properties/SAddr/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs29 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.SCol !== undefined){
let data15 = data.SCol;
const _errs31 = errors;
if(!((typeof data15 == "number") && (isFinite(data15)))){
validate20.errors = [{instancePath:instancePath+"/SCol",schemaPath:"#/properties/SCol/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs31 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.SLine !== undefined){
let data16 = data.SLine;
const _errs33 = errors;
if(!((typeof data16 == "number") && (isFinite(data16)))){
validate20.errors = [{instancePath:instancePath+"/SLine",schemaPath:"#/properties/SLine/type",keyword:"type",params:{type: "number"},message:"must be number"}];
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
