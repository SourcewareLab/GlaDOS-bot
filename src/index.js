"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
require("dotenv/config");
var fs_1 = require("fs");
var path_1 = require("path");
var url_1 = require("url");
var ClientWithCommands = /** @class */ (function (_super) {
    __extends(ClientWithCommands, _super);
    function ClientWithCommands() {
        var _this = _super.call(this, { intents: [discord_js_1.GatewayIntentBits.Guilds] }) || this;
        _this.commands = new discord_js_1.Collection();
        return _this;
    }
    return ClientWithCommands;
}(discord_js_1.Client));
var token = process.env.TOKEN;
var client = new ClientWithCommands();
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var foldersPath = path_1.default.join(__dirname, 'commands');
var commandFolders = fs_1.default.readdirSync(foldersPath);
for (var _i = 0, commandFolders_1 = commandFolders; _i < commandFolders_1.length; _i++) {
    var folder = commandFolders_1[_i];
    var commandsPath = path_1.default.join(foldersPath, folder);
    var commandFiles = fs_1.default.readdirSync(commandsPath).filter(function (file) { return file.endsWith('.js'); });
    for (var _a = 0, commandFiles_1 = commandFiles; _a < commandFiles_1.length; _a++) {
        var file = commandFiles_1[_a];
        var filePath = path_1.default.join(commandsPath, file);
        var command = (await Promise.resolve("".concat((0, url_1.pathToFileURL)(filePath).toString())).then(function (s) { return require(s); })).command;
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
        else {
            console.log("[WARNING] The command at ".concat(filePath, " is missing a required \"data\" or \"execute\" propriety."));
        }
    }
    console.log(client.commands);
}
client.once(discord_js_1.Events.ClientReady, function (readyClient) {
    console.log('Ready!', "Logged in as ".concat(readyClient.user.tag));
});
client.on(discord_js_1.Events.InteractionCreate, function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var command, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isChatInputCommand())
                    return [2 /*return*/];
                command = client.commands.get(interaction.commandName);
                if (!command) {
                    console.error("No command matching ".concat(interaction.commandName, " was found."));
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 8]);
                return [4 /*yield*/, command.execute(interaction)];
            case 2:
                _a.sent();
                return [3 /*break*/, 8];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                if (!(interaction.replied || interaction.deferred)) return [3 /*break*/, 5];
                return [4 /*yield*/, interaction.followUp({ content: 'There was an error while executing this command!', flags: discord_js_1.MessageFlags.Ephemeral })];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, interaction.reply({ content: 'There was an error while executing this command!', flags: discord_js_1.MessageFlags.Ephemeral })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
client.login(token);
