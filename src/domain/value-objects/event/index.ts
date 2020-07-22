import { none } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import * as UUID from "../uuid";
import * as NameSpace from "../namespace";
import * as TimeStamp from "../timestamp";
import * as Json from "../json";
import * as OptionFromNullable from "../option-from-nullable";

export const Name = "event";
export const Codec = iots.type(
  {
    id: UUID.Codec,
    timestamp: TimeStamp.Codec,
    corr: OptionFromNullable.Codec(UUID.Codec),
  },
  Name
);

export type CodecType = iots.TypeOf<typeof Codec>;

export type T = {
  type: NameSpace.T;
  [key: string]: any;
} & CodecType;

export type SerializedT = Json.JObject & {
  type: string;
};

export const C = (): CodecType => ({
  timestamp: TimeStamp.C(),
  id: UUID.C(),
  corr: none,
});

export const Is = Codec.is;

export const SortByDate = (events: T[]): T[] =>
  events.sort((left, right) =>
    TimeStamp.Compare(left.timestamp, right.timestamp)
  );
