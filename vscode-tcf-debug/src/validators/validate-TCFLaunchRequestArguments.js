"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","properties":{"__restart":{"description":"Arbitrary data from the previous, restarted session.\nThe data is sent as the `restart` attribute of the `terminated` event.\nThe client should leave the data intact."},"breakpointPrefix":{"type":"string"},"debugTCFMessages":{"description":"Show TCF messages in the debug console","type":"boolean"},"host":{"default":"localhost","description":"(Remote) TCF agent host","type":"string"},"internal":{"properties":{"commandToken":{"default":"default","description":"Normally TCF command tokens are very terse identifiers which make manually reading the TCF messages hard.\nIf this property is set to `debug` a more verbose command token is used which makes the reply easier to\nunderstand.","enum":["debug","default"],"type":"string"},"debugTCFMessages":{"description":"Show TCF messages in the debug console","type":"boolean"}},"type":"object"},"noDebug":{"description":"If true, the launch request should launch the program without enabling debugging.","type":"boolean"},"pathMapper":{"default":"return function (path, context) { return path; }","description":"A Javascript function to map a local path to the debugger path","type":"string"},"playback":{"description":"File path with recorded TCF message which will be used to replay TCF messages (host and port will be ignored)","type":"string"},"playbackFlag":{"properties":{"consumeEventsRepliesEagerly":{"description":"The mock socket is not strict about ordering. Most replies are delayed until\na command actually comes in. This is designed to accomodate timing variations in how\nthe user / code may invoke commands.\n\nIf this flag is `true` it consumes events and replies eagerly. This may break\nmost scenarios but may also be preferable in other situations (eg. specific tests).","type":"boolean"}},"type":"object"},"port":{"default":1534,"description":"TCF connection port","type":"number"},"record":{"description":"File path where TCF messages will be recorded into","type":"string"},"stackTraceDepth":{"description":"Maximum number of stack frames that a stackTrace can have. Unlimited, if not defined.","type":"number"},"timeout":{"default":10000,"description":"Debug commands timeout (milliseconds)","type":"number"}},"type":"object"};

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
if(data.internal !== undefined){
let data3 = data.internal;
const _errs7 = errors;
if(errors === _errs7){
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
if(data3.commandToken !== undefined){
let data4 = data3.commandToken;
const _errs9 = errors;
if(typeof data4 !== "string"){
validate20.errors = [{instancePath:instancePath+"/internal/commandToken",schemaPath:"#/properties/internal/properties/commandToken/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((data4 === "debug") || (data4 === "default"))){
validate20.errors = [{instancePath:instancePath+"/internal/commandToken",schemaPath:"#/properties/internal/properties/commandToken/enum",keyword:"enum",params:{allowedValues: schema22.properties.internal.properties.commandToken.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid1 = _errs9 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data3.debugTCFMessages !== undefined){
const _errs11 = errors;
if(typeof data3.debugTCFMessages !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/internal/debugTCFMessages",schemaPath:"#/properties/internal/properties/debugTCFMessages/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid1 = _errs11 === errors;
}
else {
var valid1 = true;
}
}
}
else {
validate20.errors = [{instancePath:instancePath+"/internal",schemaPath:"#/properties/internal/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.noDebug !== undefined){
const _errs13 = errors;
if(typeof data.noDebug !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/noDebug",schemaPath:"#/properties/noDebug/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.pathMapper !== undefined){
const _errs15 = errors;
if(typeof data.pathMapper !== "string"){
validate20.errors = [{instancePath:instancePath+"/pathMapper",schemaPath:"#/properties/pathMapper/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playback !== undefined){
const _errs17 = errors;
if(typeof data.playback !== "string"){
validate20.errors = [{instancePath:instancePath+"/playback",schemaPath:"#/properties/playback/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs17 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackFlag !== undefined){
let data9 = data.playbackFlag;
const _errs19 = errors;
if(errors === _errs19){
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
if(data9.consumeEventsRepliesEagerly !== undefined){
if(typeof data9.consumeEventsRepliesEagerly !== "boolean"){
validate20.errors = [{instancePath:instancePath+"/playbackFlag/consumeEventsRepliesEagerly",schemaPath:"#/properties/playbackFlag/properties/consumeEventsRepliesEagerly/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
}
else {
validate20.errors = [{instancePath:instancePath+"/playbackFlag",schemaPath:"#/properties/playbackFlag/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs19 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.port !== undefined){
let data11 = data.port;
const _errs23 = errors;
if(!((typeof data11 == "number") && (isFinite(data11)))){
validate20.errors = [{instancePath:instancePath+"/port",schemaPath:"#/properties/port/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs23 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.record !== undefined){
const _errs25 = errors;
if(typeof data.record !== "string"){
validate20.errors = [{instancePath:instancePath+"/record",schemaPath:"#/properties/record/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.stackTraceDepth !== undefined){
let data13 = data.stackTraceDepth;
const _errs27 = errors;
if(!((typeof data13 == "number") && (isFinite(data13)))){
validate20.errors = [{instancePath:instancePath+"/stackTraceDepth",schemaPath:"#/properties/stackTraceDepth/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs27 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.timeout !== undefined){
let data14 = data.timeout;
const _errs29 = errors;
if(!((typeof data14 == "number") && (isFinite(data14)))){
validate20.errors = [{instancePath:instancePath+"/timeout",schemaPath:"#/properties/timeout/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs29 === errors;
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
else {
validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}
