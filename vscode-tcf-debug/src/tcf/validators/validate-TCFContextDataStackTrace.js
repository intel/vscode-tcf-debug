"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","definitions":{"TCFCodeAreaLineNumbers":{"properties":{"BasicBlock":{"type":"boolean"},"Dir":{"type":"string"},"Discriminator":{"type":"number"},"EAddr":{"type":"number"},"ECol":{"type":"number"},"ELine":{"type":"number"},"EpilogueBegin":{"type":"boolean"},"File":{"type":"string"},"ISA":{"type":"number"},"IsStmt":{"type":"boolean"},"NAddr":{"type":"number"},"NStmtAddr":{"type":"number"},"OpIndex":{"type":"number"},"PrologueEnd":{"type":"boolean"},"SAddr":{"type":"number"},"SCol":{"type":"number"},"SLine":{"type":"number"}},"type":"object"}},"properties":{"ArgsAddr":{"type":"number"},"ArgsCnt":{"type":"number"},"CodeArea":{"$ref":"#/definitions/TCFCodeAreaLineNumbers"},"FP":{"type":"number"},"FuncID":{"type":"string"},"ID":{"type":"string"},"IP":{"type":"number"},"Index":{"type":"number"},"Name":{"type":"string"},"ParentID":{"type":"string"},"ProcessID":{"type":"string"},"RP":{"type":"number"},"TopFrame":{"type":"boolean"},"Walk":{"type":"boolean"}},"required":["ID"],"type":"object"};
const schema23 = {"properties":{"BasicBlock":{"type":"boolean"},"Dir":{"type":"string"},"Discriminator":{"type":"number"},"EAddr":{"type":"number"},"ECol":{"type":"number"},"ELine":{"type":"number"},"EpilogueBegin":{"type":"boolean"},"File":{"type":"string"},"ISA":{"type":"number"},"IsStmt":{"type":"boolean"},"NAddr":{"type":"number"},"NStmtAddr":{"type":"number"},"OpIndex":{"type":"number"},"PrologueEnd":{"type":"boolean"},"SAddr":{"type":"number"},"SCol":{"type":"number"},"SLine":{"type":"number"}},"type":"object"};

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
if(data.ArgsAddr !== undefined){
let data0 = data.ArgsAddr;
const _errs1 = errors;
if(!((typeof data0 == "number") && (isFinite(data0)))){
validate20.errors = [{instancePath:instancePath+"/ArgsAddr",schemaPath:"#/properties/ArgsAddr/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ArgsCnt !== undefined){
let data1 = data.ArgsCnt;
const _errs3 = errors;
if(!((typeof data1 == "number") && (isFinite(data1)))){
validate20.errors = [{instancePath:instancePath+"/ArgsCnt",schemaPath:"#/properties/ArgsCnt/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.CodeArea !== undefined){
let data2 = data.CodeArea;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.BasicBlock !== undefined){
const _errs8 = errors;
if(typeof data2.BasicBlock !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/CodeArea/BasicBlock",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/BasicBlock/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid2 = _errs8 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.Dir !== undefined){
const _errs10 = errors;
if(typeof data2.Dir !== "string"){
validate20.errors = [{instancePath:instancePath+"/CodeArea/Dir",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/Dir/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid2 = _errs10 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.Discriminator !== undefined){
let data5 = data2.Discriminator;
const _errs12 = errors;
if(!((typeof data5 == "number") && (isFinite(data5)))){
validate20.errors = [{instancePath:instancePath+"/CodeArea/Discriminator",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/Discriminator/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.EAddr !== undefined){
let data6 = data2.EAddr;
const _errs14 = errors;
if(!((typeof data6 == "number") && (isFinite(data6)))){
validate20.errors = [{instancePath:instancePath+"/CodeArea/EAddr",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/EAddr/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs14 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.ECol !== undefined){
let data7 = data2.ECol;
const _errs16 = errors;
if(!((typeof data7 == "number") && (isFinite(data7)))){
validate20.errors = [{instancePath:instancePath+"/CodeArea/ECol",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/ECol/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs16 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.ELine !== undefined){
let data8 = data2.ELine;
const _errs18 = errors;
if(!((typeof data8 == "number") && (isFinite(data8)))){
validate20.errors = [{instancePath:instancePath+"/CodeArea/ELine",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/ELine/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs18 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.EpilogueBegin !== undefined){
const _errs20 = errors;
if(typeof data2.EpilogueBegin !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/CodeArea/EpilogueBegin",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/EpilogueBegin/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid2 = _errs20 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.File !== undefined){
const _errs22 = errors;
if(typeof data2.File !== "string"){
validate20.errors = [{instancePath:instancePath+"/CodeArea/File",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/File/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid2 = _errs22 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.ISA !== undefined){
let data11 = data2.ISA;
const _errs24 = errors;
if(!((typeof data11 == "number") && (isFinite(data11)))){
validate20.errors = [{instancePath:instancePath+"/CodeArea/ISA",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/ISA/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs24 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.IsStmt !== undefined){
const _errs26 = errors;
if(typeof data2.IsStmt !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/CodeArea/IsStmt",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/IsStmt/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid2 = _errs26 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.NAddr !== undefined){
let data13 = data2.NAddr;
const _errs28 = errors;
if(!((typeof data13 == "number") && (isFinite(data13)))){
validate20.errors = [{instancePath:instancePath+"/CodeArea/NAddr",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/NAddr/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs28 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.NStmtAddr !== undefined){
let data14 = data2.NStmtAddr;
const _errs30 = errors;
if(!((typeof data14 == "number") && (isFinite(data14)))){
validate20.errors = [{instancePath:instancePath+"/CodeArea/NStmtAddr",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/NStmtAddr/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs30 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.OpIndex !== undefined){
let data15 = data2.OpIndex;
const _errs32 = errors;
if(!((typeof data15 == "number") && (isFinite(data15)))){
validate20.errors = [{instancePath:instancePath+"/CodeArea/OpIndex",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/OpIndex/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs32 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.PrologueEnd !== undefined){
const _errs34 = errors;
if(typeof data2.PrologueEnd !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/CodeArea/PrologueEnd",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/PrologueEnd/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid2 = _errs34 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.SAddr !== undefined){
let data17 = data2.SAddr;
const _errs36 = errors;
if(!((typeof data17 == "number") && (isFinite(data17)))){
validate20.errors = [{instancePath:instancePath+"/CodeArea/SAddr",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/SAddr/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs36 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.SCol !== undefined){
let data18 = data2.SCol;
const _errs38 = errors;
if(!((typeof data18 == "number") && (isFinite(data18)))){
validate20.errors = [{instancePath:instancePath+"/CodeArea/SCol",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/SCol/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs38 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.SLine !== undefined){
let data19 = data2.SLine;
const _errs40 = errors;
if(!((typeof data19 == "number") && (isFinite(data19)))){
validate20.errors = [{instancePath:instancePath+"/CodeArea/SLine",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/properties/SLine/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs40 === errors;
}
else {
var valid2 = true;
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
validate20.errors = [{instancePath:instancePath+"/CodeArea",schemaPath:"#/definitions/TCFCodeAreaLineNumbers/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.FP !== undefined){
let data20 = data.FP;
const _errs42 = errors;
if(!((typeof data20 == "number") && (isFinite(data20)))){
validate20.errors = [{instancePath:instancePath+"/FP",schemaPath:"#/properties/FP/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs42 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.FuncID !== undefined){
const _errs44 = errors;
if(typeof data.FuncID !== "string"){
validate20.errors = [{instancePath:instancePath+"/FuncID",schemaPath:"#/properties/FuncID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs44 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ID !== undefined){
const _errs46 = errors;
if(typeof data.ID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ID",schemaPath:"#/properties/ID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs46 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.IP !== undefined){
let data23 = data.IP;
const _errs48 = errors;
if(!((typeof data23 == "number") && (isFinite(data23)))){
validate20.errors = [{instancePath:instancePath+"/IP",schemaPath:"#/properties/IP/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs48 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Index !== undefined){
let data24 = data.Index;
const _errs50 = errors;
if(!((typeof data24 == "number") && (isFinite(data24)))){
validate20.errors = [{instancePath:instancePath+"/Index",schemaPath:"#/properties/Index/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs50 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Name !== undefined){
const _errs52 = errors;
if(typeof data.Name !== "string"){
validate20.errors = [{instancePath:instancePath+"/Name",schemaPath:"#/properties/Name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs52 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ParentID !== undefined){
const _errs54 = errors;
if(typeof data.ParentID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ParentID",schemaPath:"#/properties/ParentID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs54 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ProcessID !== undefined){
const _errs56 = errors;
if(typeof data.ProcessID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ProcessID",schemaPath:"#/properties/ProcessID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs56 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.RP !== undefined){
let data28 = data.RP;
const _errs58 = errors;
if(!((typeof data28 == "number") && (isFinite(data28)))){
validate20.errors = [{instancePath:instancePath+"/RP",schemaPath:"#/properties/RP/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs58 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.TopFrame !== undefined){
const _errs60 = errors;
if(typeof data.TopFrame !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/TopFrame",schemaPath:"#/properties/TopFrame/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs60 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Walk !== undefined){
const _errs62 = errors;
if(typeof data.Walk !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/Walk",schemaPath:"#/properties/Walk/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs62 === errors;
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
else {
validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}
