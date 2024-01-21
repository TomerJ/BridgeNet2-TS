/// <reference types="@rbxts/types" />

type MetaMessage = "1";

type ServerConnectionCallback = (player: Player, content: Content) => void;
type Content = unknown;
type Identifier = string;

// Player containers
type PlayerContainerTypes = "all" | "set" | "except" | "single";
interface PlayerContainer {
	kind: PlayerContainerTypes;
}
interface SetPlayerContainer extends PlayerContainer {
	kind: "set";
	value: Array<Player>;
}
interface ExceptPlayerContainer extends PlayerContainer {
	kind: "except";
	value: { [index: number]: Player };
}
interface SinglePlayerContainer extends PlayerContainer {
	kind: "single";
	value: Player;
}
interface AllPlayerContainer extends PlayerContainer {
	kind: "all";
}

type PlayerContainerIndexes = {
	All: () => AllPlayerContainer;
	Except: (excludedPlayers: Array<Player>) => ExceptPlayerContainer;
	Single: (player: Player) => SinglePlayerContainer;
	Players: (players: Array<Player>) => SetPlayerContainer;
};

type ServerInboundPacket = {};
type ServerOutboundPacket = {
	playerContainer: PlayerContainer;
	content: unknown;
	id: Identifier;
};

export interface Bridge {
	Logging: boolean;
}
export interface ServerBridge {
	Fire(this: ServerBridge, target: Player | (AllPlayerContainer | SetPlayerContainer), content: Content): void;
	Connect(this: ServerBridge, callback: (player: Player, content?: Content) => void): Connection;
	Once(this: ServerBridge, callback: (player: Player, content?: Content) => void): void;
	Wait(this: ServerBridge, callback: (player: Player, content?: Content) => void): LuaTuple<[Player, Content?]>;

	OnServerInvoke?: (player: Player, content: Content) => LuaTuple<[Content]>;
	RateLimitActive: boolean;
}
export interface ClientBridge extends Bridge {
	Fire(this: ClientBridge, content?: Content): void;
	Connect(this: ClientBridge, callback: (content?: Content) => void): Connection;
	Once(this: ClientBridge, callback: (content?: Content) => void): void;
	Wait(this: ClientBridge, callback: (content?: Content) => void): Content | undefined;

	InvokeServerAsync: (this: ClientBridge, content?: Content) => LuaTuple<[Content?]>;
}

export interface Connection {
	Disconnect: () => void;
}

export namespace BridgeNet2 {
	export function ReferenceBridge(name: string): Bridge;

	export function ClientBridge(name: string): ClientBridge;
	export function ServerBridge(name: string): ServerBridge;

	export function ReferenceIdentifier(name: string, maxWaitTime: number): Identifier;

	export function Serialize(identifierName: string): Identifier;
	export function Deserialize(compressedIdentifier: string): Identifier;

	export function ToHex(regularString: string): string;
	export function ToReadableHex(regularString: string): string;
	export function FromHex(hexadecimal: string): string;

	export function Players(players: Array<Player>): SetPlayerContainer;
	export function AllPlayers(): AllPlayerContainer;
	export function PlayersExcept(excludedPlayers: Array<Player>): ExceptPlayerContainer;

	export function CreateUUID(): string;

	export function HandleInvalidPlayer(handler: (player: Player) => void): void;
}