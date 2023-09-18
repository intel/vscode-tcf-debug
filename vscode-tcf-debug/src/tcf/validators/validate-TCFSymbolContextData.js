"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","definitions":{"TCFSymbolClass":{"enum":[0,1,2,3,4,5,6,7,8,9],"type":"number"}},"properties":{"Address":{"type":"number"},"BaseTypeID":{"type":["null","string"]},"Class":{"$ref":"#/definitions/TCFSymbolClass"},"ContainerID":{"type":["null","string"]},"Flags":{"type":"number"},"ID":{"type":"string"},"Length":{"type":"number"},"Name":{"type":["null","string"]},"Offset":{"type":"number"},"OwnerID":{"type":"string"},"Register":{"type":"string"},"Size":{"type":"number"},"TypeClass":{"enum":[0,1,10,2,3,4,5,6,7,8,9],"type":"number"},"TypeID":{"type":"string"},"UpdatePolicy":{"type":"number"},"Value":{"type":"string"}},"required":["Class","ID"],"type":"object"};
const schema23 = {"enum":[0,1,2,3,4,5,6,7,8,9],"type":"number"};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.Class === undefined) && (missing0 = "Class")) || ((data.ID === undefined) && (missing0 = "ID"))){
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
if(data.BaseTypeID !== undefined){
let data1 = data.BaseTypeID;
const _errs3 = errors;
if((data1 !== null) && (typeof data1 !== "string")){
validate20.errors = [{instancePath:instancePath+"/BaseTypeID",schemaPath:"#/properties/BaseTypeID/type",keyword:"type",params:{type: schema22.properties.BaseTypeID.type},message:"must be null,string"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Class !== undefined){
let data2 = data.Class;
const _errs5 = errors;
if(!((typeof data2 == "number") && (isFinite(data2)))){
validate20.errors = [{instancePath:instancePath+"/Class",schemaPath:"#/definitions/TCFSymbolClass/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
if(!((((((((((data2 === 0) || (data2 === 1)) || (data2 === 2)) || (data2 === 3)) || (data2 === 4)) || (data2 === 5)) || (data2 === 6)) || (data2 === 7)) || (data2 === 8)) || (data2 === 9))){
validate20.errors = [{instancePath:instancePath+"/Class",schemaPath:"#/definitions/TCFSymbolClass/enum",keyword:"enum",params:{allowedValues: schema23.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ContainerID !== undefined){
let data3 = data.ContainerID;
const _errs8 = errors;
if((data3 !== null) && (typeof data3 !== "string")){
validate20.errors = [{instancePath:instancePath+"/ContainerID",schemaPath:"#/properties/ContainerID/type",keyword:"type",params:{type: schema22.properties.ContainerID.type},message:"must be null,string"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Flags !== undefined){
let data4 = data.Flags;
const _errs10 = errors;
if(!((typeof data4 == "number") && (isFinite(data4)))){
validate20.errors = [{instancePath:instancePath+"/Flags",schemaPath:"#/properties/Flags/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ID !== undefined){
const _errs12 = errors;
if(typeof data.ID !== "string"){
validate20.errors = [{instancePath:instancePath+"/ID",schemaPath:"#/properties/ID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Length !== undefined){
let data6 = data.Length;
const _errs14 = errors;
if(!((typeof data6 == "number") && (isFinite(data6)))){
validate20.errors = [{instancePath:instancePath+"/Length",schemaPath:"#/properties/Length/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Name !== undefined){
let data7 = data.Name;
const _errs16 = errors;
if((data7 !== null) && (typeof data7 !== "string")){
validate20.errors = [{instancePath:instancePath+"/Name",schemaPath:"#/properties/Name/type",keyword:"type",params:{type: schema22.properties.Name.type},message:"must be null,string"}];
return false;
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Offset !== undefined){
let data8 = data.Offset;
const _errs18 = errors;
if(!((typeof data8 == "number") && (isFinite(data8)))){
validate20.errors = [{instancePath:instancePath+"/Offset",schemaPath:"#/properties/Offset/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.OwnerID !== undefined){
const _errs20 = errors;
if(typeof data.OwnerID !== "string"){
validate20.errors = [{instancePath:instancePath+"/OwnerID",schemaPath:"#/properties/OwnerID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs20 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Register !== undefined){
const _errs22 = errors;
if(typeof data.Register !== "string"){
validate20.errors = [{instancePath:instancePath+"/Register",schemaPath:"#/properties/Register/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Size !== undefined){
let data11 = data.Size;
const _errs24 = errors;
if(!((typeof data11 == "number") && (isFinite(data11)))){
validate20.errors = [{instancePath:instancePath+"/Size",schemaPath:"#/properties/Size/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.TypeClass !== undefined){
let data12 = data.TypeClass;
const _errs26 = errors;
if(!((typeof data12 == "number") && (isFinite(data12)))){
validate20.errors = [{instancePath:instancePath+"/TypeClass",schemaPath:"#/properties/TypeClass/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
if(!(((((((((((data12 === 0) || (data12 === 1)) || (data12 === 10)) || (data12 === 2)) || (data12 === 3)) || (data12 === 4)) || (data12 === 5)) || (data12 === 6)) || (data12 === 7)) || (data12 === 8)) || (data12 === 9))){
validate20.errors = [{instancePath:instancePath+"/TypeClass",schemaPath:"#/properties/TypeClass/enum",keyword:"enum",params:{allowedValues: schema22.properties.TypeClass.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs26 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.TypeID !== undefined){
const _errs28 = errors;
if(typeof data.TypeID !== "string"){
validate20.errors = [{instancePath:instancePath+"/TypeID",schemaPath:"#/properties/TypeID/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs28 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.UpdatePolicy !== undefined){
let data14 = data.UpdatePolicy;
const _errs30 = errors;
if(!((typeof data14 == "number") && (isFinite(data14)))){
validate20.errors = [{instancePath:instancePath+"/UpdatePolicy",schemaPath:"#/properties/UpdatePolicy/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs30 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.Value !== undefined){
const _errs32 = errors;
if(typeof data.Value !== "string"){
validate20.errors = [{instancePath:instancePath+"/Value",schemaPath:"#/properties/Value/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
