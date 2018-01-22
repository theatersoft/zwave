const CommandClass = {
// Z-Wave Command Class Specification, A-M Table 6, General purpose Command Class identifiers
Alarm: 0x71, // 113
Antitheft: 0x5D,
ApplicationCapability: 0x57,
ApplicationStatus: 0x22,
Association: 0x85,
AssociationCommandConfiguration: 0x9B,
AssociationGroupInformation: 0x59,
Battery: 0x80, // 128
CentralScene: 0x5B,
Clock: 0x81,
Configuration: 0x70, // 112
ControllerReplication: 0x21,
CRC16Encapsulation: 0x56,
DeviceResetLocally: 0x5A,
FirmwareUpdateMetaData: 0x7A,
GeographicLocation: 0x8C,
GroupingName: 0x7B,
Hail: 0x82,
Indicator: 0x87, // 135
IPAssociation: 0x5C,
IPConfiguration: 0x9A, // [OBSOLETED]
Language: 0x89,
Mailbox: 0x69,
ManufacturerProprietary: 0x91,
ManufacturerSpecific: 0x72,
Mark: 0xEF,
MultiChannel: 0x60,
MultiChannelAssociation: 0x8E,
MultiCommand: 0x8F,
NetworkManagementBasicNode: 0x4D,
NetworkManagementInclusion: 0x34,
NetworkManagementPrimary: 0x54,
NetworkManagementProxy: 0x52,
NoOperation: 0x00,
NodeNamingAndLocation: 0x77,
Noninteroperable: 0xF0,
Notification: 0x71,
Proprietary: 0x88, // [DEPRECATED]
RemoteAssociationActivate: 0x7C, // [OBSOLETED]
RemoteAssociationConfiguration: 0x7D, // [OBSOLETED]
Schedule: 0x53,
ScreenAttributes: 0x93,
ScreenMD: 0x92,
Security: 0x98, // 152
SecurityScheme0Mark: 0xF100,
Supervision: 0x6C,
Time: 0x8A,
TimeParameters: 0x8B,
TransportService: 0x55,
UserCode: 0x63, // 99
Version: 0x86, // 134
WakeUp: 0x84, // 132
ZIP: 0x23,
ZIPNaming: 0x68,
ZIPND: 0x58,
ZIPLoWPAN: 0x4F,
ZIPGateway: 0x5F,
ZIPPortal: 0x61,
ZWavePlusInfo: 0x5E, // 94

// Z-Wave Command Class Specification, A-M Table 7, Device related Command Class identifiers
AlarmSensor: 0x9C, // [DEPRECATED]
AlarmSilence: 0x9D,
AllSwitch: 0x27,
BarrierOperator: 0x66,
Basic: 0x20,
BasicTariffInformation: 0x36,
BasicWindowCovering: 0x50, // [OBSOLETED]
BinarySensor: 0x30, // 48 [DEPRECATED]
BinarySwitch: 0x25, // 37
BinaryToggleSwitch: 0x28, // [DEPRECATED]
ClimateControlSchedule: 0x46, // [DEPRECATED]
ColorSwitch: 0x33,
DCPListConfiguration: 0x3A,
DCPListMonitoring: 0x3B,
DoorLock: 0x62, // 98
DoorLockLogging: 0x4C,
EnergyProduction: 0x90,
EntryControl: 0x6F,
HRVStatus: 0x37,
HRVControl: 0x39,
HumidityControlMode: 0x6D,
HumidityControlOperatingState: 0x6E,
HumidityControlSetpoint: 0x64,
Irrigation: 0x6B,
Lock: 0x76,
Meter: 0x32,
MeterTableConfiguration: 0x3C,
MeterTableMonitor: 0x3D,
MeterTablePushConfiguration: 0x3E,
MoveToPositionWindowCovering: 0x51, // [OBSOLETED]
MultilevelSensor: 0x31, // 49
MultilevelSwitch: 0x26,
MultilevelToggleSwitch: 0x29,
Powerlevel: 0x73, // 115
Prepayment: 0x3F,
PrepaymentEncapsulation: 0x41,
Protection: 0x75,
PulseMeter: 0x35, // [DEPRECATED]
RateTableConfiguration: 0x48,
RateTableMonitoring: 0x49,
SceneActivation: 0x2B,
SceneActuatorConfiguration: 0x2C,
SceneControllerConfiguration: 0x2D,
ScheduleEntryLock: 0x4E, // [DEPRECATED]
SensorConfiguration: 0x9E, // [OBSOLETED]
SimpleAVControl: 0x94,
TariffTableConfiguration: 0x4A,
TariffTableMonitor: 0x4B,
ThermostatFanMode: 0x44,
ThermostatFanState: 0x45,
ThermostatMode: 0x40,
ThermostatOperatingState: 0x42,
ThermostatSetback: 0x47,
ThermostatSetpoint: 0x43,
WindowCovering: 0x6A
}
export default CommandClass
