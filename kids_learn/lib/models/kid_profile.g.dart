// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'kid_profile.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class KidProfileAdapter extends TypeAdapter<KidProfile> {
  @override
  final int typeId = 0;

  @override
  KidProfile read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return KidProfile(
      name: fields[0] as String,
      age: fields[1] as int,
      grade: fields[2] as String,
      language: fields[3] as String,
      avatarPath: fields[4] as String,
      totalPoints: fields[5] as int,
      currentStreak: fields[6] as int,
      lastActiveDate: fields[7] as DateTime?,
      completedLessons: (fields[8] as List?)?.cast<String>(),
      earnedBadges: (fields[9] as List?)?.cast<String>(),
    );
  }

  @override
  void write(BinaryWriter writer, KidProfile obj) {
    writer
      ..writeByte(10)
      ..writeByte(0)
      ..write(obj.name)
      ..writeByte(1)
      ..write(obj.age)
      ..writeByte(2)
      ..write(obj.grade)
      ..writeByte(3)
      ..write(obj.language)
      ..writeByte(4)
      ..write(obj.avatarPath)
      ..writeByte(5)
      ..write(obj.totalPoints)
      ..writeByte(6)
      ..write(obj.currentStreak)
      ..writeByte(7)
      ..write(obj.lastActiveDate)
      ..writeByte(8)
      ..write(obj.completedLessons)
      ..writeByte(9)
      ..write(obj.earnedBadges);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is KidProfileAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
