import { useState, useMemo, useRef, useEffect, useCallback } from "react";

const GENRES = ["アクション", "アドベンチャー", "RPG", "シューティング", "パズル", "シミュレーション", "ローグライク", "その他"];

const GAMES = [
  { id: 1, title: "City of None", booth: "1F-D01", floor: "1F", exhibitor: "Extremely OK Games", genre: "アクション", description: "アクション×アドベンチャー×プラットフォーマー。" },
  { id: 2, title: "CYCLIA JOURNEY", booth: "1F-D02", floor: "1F", exhibitor: "Wonderfy Inc.", genre: "アクション", description: "アクション×プラットフォーマー×パズル。Switch/PC対応。" },
  { id: 3, title: "Delve Survivors", booth: "1F-D03", floor: "1F", exhibitor: "iDiOSLAB", genre: "ローグライク", description: "サバイバー系ローグライト。" },
  { id: 4, title: "EnthuBike – Motorcycle Handlebar Controller", booth: "1F-D04", floor: "1F", exhibitor: "Koshizawa Equipment Industry Co., Ltd.", genre: "その他", description: "バイクのハンドル型コントローラー。" },
  { id: 5, title: "代償少女 (Compensated Girl)", booth: "1F-D05", floor: "1F", exhibitor: "代償プロジェクト", genre: "アドベンチャー", description: "代償少女。日本のインディー作品。" },
  { id: 6, title: "ウルトラジェットガール (Ultra Jet Girl)", booth: "1F-D06", floor: "1F", exhibitor: "Ashiya", genre: "アクション", description: "ウルトラジェットガール。" },
  { id: 7, title: "4DEAD", booth: "1F-D07", floor: "1F", exhibitor: "Kishiro", genre: "アクション", description: "ローグライクアクション。Steam対応。" },
  { id: 8, title: "カルチャーハウス (CultureHouse)", booth: "1F-D08", floor: "1F", exhibitor: "futurala", genre: "アドベンチャー", description: "カルチャーハウス。" },
  { id: 9, title: "Astromine", booth: "1F-D09", floor: "1F", exhibitor: "Alientrap", genre: "アクション", description: "アクションアドベンチャー。" },
  { id: 10, title: "奈落のキッチン (Abyss Kitchen)", booth: "1F-D10", floor: "1F", exhibitor: "Pico Games", genre: "シミュレーション", description: "奈落のキッチン。クッキングシミュレーション。" },
  { id: 11, title: "Max Gentlemen: Escape From Moriarty Mansion", booth: "1F-D11", floor: "1F", exhibitor: "The Men Who Wear Many Hats", genre: "パズル", description: "脱出パズルアドベンチャー。" },
  { id: 12, title: "Crabmeat", booth: "1F-D12", floor: "1F", exhibitor: "Searching Interactive", genre: "アクション", description: "カニをテーマにしたアクション。" },
  { id: 13, title: "HellPunk: Purgatorium", booth: "1F-D13", floor: "1F", exhibitor: "Urban Oasis Corp.", genre: "アクション", description: "ダークな雰囲気のアクション作品。" },
  { id: 14, title: "Heartreasure: Stellar Journey", booth: "1F-D14", floor: "1F", exhibitor: "asaha", genre: "アドベンチャー", description: "宇宙旅行をテーマにしたアドベンチャー。" },
  { id: 15, title: "Finding Polka", booth: "1F-D15", floor: "1F", exhibitor: "lidlocks", genre: "アドベンチャー", description: "ポルカを探す物語。" },
  { id: 16, title: "Servant of the Lake", booth: "1F-D16", floor: "1F", exhibitor: "Rusty Lake", genre: "パズル", description: "Rusty Lakeシリーズの新作。" },
  { id: 17, title: "DREADMOOR", booth: "1F-D17", floor: "1F", exhibitor: "Dream Dock", genre: "シミュレーション", description: "アドベンチャー×シミュレーション。PC/PS5/Xbox対応。" },
  { id: 18, title: "The Void Between (ザ・ヴォイド・ビトウィーン)", booth: "1F-D18", floor: "1F", exhibitor: "Key Compass", genre: "アドベンチャー", description: "ザ・ヴォイド・ビトウィーン。" },
  { id: 19, title: "里山のおと-春さんぽ (Satoyama Note: Spring Walk)", booth: "1F-D19", floor: "1F", exhibitor: "Satoyama Note", genre: "アドベンチャー", description: "里山のおと-春さんぽ。" },
  { id: 20, title: "Voyage Router", booth: "1F-D20", floor: "1F", exhibitor: "softoko", genre: "パズル", description: "航路パズルゲーム。" },
  { id: 21, title: "60病 (The 60-Second Syndrome)", booth: "1F-D21", floor: "1F", exhibitor: "Matrix Corporation", genre: "アドベンチャー", description: "60病。" },
  { id: 22, title: "Moldwasher", booth: "1F-D22", floor: "1F", exhibitor: "Rubel Games", genre: "アクション", description: "Rubel Gamesによる新作。" },
  { id: 23, title: "ピンボールガーデン (PinballGarden)", booth: "1F-D23", floor: "1F", exhibitor: "YawarakaSoft", genre: "アクション", description: "ピンボールガーデン。" },
  { id: 24, title: "Katubaの密猟者 (Katuba's Poacher)", booth: "1F-D24", floor: "1F", exhibitor: "Joe Yu Studio", genre: "アドベンチャー", description: "Katubaの密猟者。" },
  { id: 25, title: "キッドバッシュ：スーパーレジェンド (Kidbash: Super Legend)", booth: "1F-D25", floor: "1F", exhibitor: "Authentic Remixes & Fat Raccoon", genre: "アクション", description: "キッドバッシュ：スーパーレジェンド。" },
  { id: 26, title: "シェオルの森 - 黄昏の魔獣使い (Forest of Sheol)", booth: "1F-D26", floor: "1F", exhibitor: "PepperBomb", genre: "RPG", description: "シェオルの森-黄昏の魔獣使い。" },
  { id: 27, title: "Am I Nima", booth: "1F-D27", floor: "1F", exhibitor: "HO! Games", genre: "アドベンチャー", description: "正体不明の主人公の物語。" },
  { id: 28, title: "表面迷宮くるまぶ (Surface Labyrinth KURUMABU)", booth: "1F-D28", floor: "1F", exhibitor: "KUMAZASA", genre: "パズル", description: "表面迷宮くるまぶ。" },
  { id: 29, title: "ダンジョンクロウラー (Dungeon Clawler)", booth: "1F-D29", floor: "1F", exhibitor: "Stray Fawn Studio", genre: "ローグライク", description: "ダンジョンクロウラー：幸運ウサギと魔法の爪。" },
  { id: 30, title: "Gambonanza", booth: "1F-D30", floor: "1F", exhibitor: "Blukulélé", genre: "その他", description: "ガンボナンザ。" },
  { id: 31, title: "TCG Card Shop Simulator", booth: "1F-D31", floor: "1F", exhibitor: "O.P. Neon Games", genre: "シミュレーション", description: "TCGカードショップシミュレーター。" },
  { id: 32, title: "モノノケの国 (Mononoke No Kuni)", booth: "1F-D32", floor: "1F", exhibitor: "Lights Interactive", genre: "アドベンチャー", description: "モノノケの国。異世界アクションアドベンチャー。Steam 2026年発売予定。" },
  { id: 33, title: "Die Deep (死深)", booth: "1F-D33", floor: "1F", exhibitor: "PINIX Games", genre: "アクション", description: "死深。アクションゲーム。Steam対応。" },
  { id: 34, title: "Ninja or Die 2 Die", booth: "1F-D34", floor: "1F", exhibitor: "Nao Games", genre: "アクション", description: "Ninja or Dieシリーズの続編。" },
  { id: 35, title: "輪廻戦 Mad King Redemption", booth: "1F-D35", floor: "1F", exhibitor: "SECRET MISSION", genre: "RPG", description: "輪廻戦-Mad King Redemption。" },
  { id: 36, title: "Miniature LAND -Four Seasons-", booth: "1F-D36", floor: "1F", exhibitor: "WarmingApp", genre: "シミュレーション", description: "ミニチュアの世界を楽しむ。" },
  { id: 37, title: "Foo Is Missing", booth: "1F-D37", floor: "1F", exhibitor: "Neutral Software Inc.", genre: "アドベンチャー", description: "Fooを探す物語。" },
  { id: 38, title: "リズムホテル (Rhythm Hotel)", booth: "1F-D38", floor: "1F", exhibitor: "SyncArc-Studio", genre: "音楽", description: "リズムホテル。" },
  { id: 39, title: "A Tiny Wander", booth: "1F-D39", floor: "1F", exhibitor: "DOUKUTSU PENGUIN CLUB", genre: "アドベンチャー", description: "アドベンチャー×パズル。Steam対応。" },
  { id: 40, title: "Bento Blocks", booth: "1F-D40", floor: "1F", exhibitor: "SOMETIMES LIMITED", genre: "パズル", description: "ポイント＆クリックパズル。Steam対応。" },
  { id: 41, title: "オニクラ (Onikura)", booth: "1F-D41", floor: "1F", exhibitor: "Too Dark Studio", genre: "アクション", description: "オニクラ。" },
  { id: 42, title: "Magical Blush (マジカル・ブラッシュ)", booth: "1F-D42", floor: "1F", exhibitor: "Alkacer Game Studio", genre: "アクション", description: "マジカル・ブラッシュ。" },
  { id: 43, title: "Near The Sun", booth: "1F-D43", floor: "1F", exhibitor: "Nonlinear", genre: "アドベンチャー", description: "太陽に近い物語。" },
  { id: 44, title: "赫夜 (Kaguya)", booth: "1F-D44", floor: "1F", exhibitor: "Flypot LLC", genre: "アドベンチャー", description: "赫夜（カグヤ）。" },
  { id: 45, title: "人狼バーガー (Jinro Burger)", booth: "1F-D45", floor: "1F", exhibitor: "uracon LLC.", genre: "パーティ", description: "人狼バーガー。" },
  { id: 46, title: "Thumbylina", booth: "1F-D46", floor: "1F", exhibitor: "LeonaSoftware", genre: "アクション", description: "サムビリーナ。" },
  { id: 47, title: "Type & Magic", booth: "1F-D47", floor: "1F", exhibitor: "Decoboco Games", genre: "RPG", description: "タイピング×マジック。" },
  { id: 48, title: "Little Cheese Works", booth: "1F-D48", floor: "1F", exhibitor: "BUBBLE　GUM", genre: "シミュレーション", description: "リトルチーズワークス。" },
  { id: 49, title: "Bytes and Knights - Adventure", booth: "1F-D49", floor: "1F", exhibitor: "Jonathan Holmes (crait)", genre: "アドベンチャー", description: "バイト＆ナイトのアドベンチャー。" },
  { id: 50, title: "スマイルマッスルトレーナー (Smile Muscle Trainer)", booth: "1F-D50", floor: "1F", exhibitor: "Software Control Corporation", genre: "その他", description: "スマイルマッスルトレーナー。" },
  { id: 51, title: "天使機構 - 執行部魂救済課 (Angelic Agency)", booth: "1F-D51", floor: "1F", exhibitor: "YOKUNIKU", genre: "アドベンチャー", description: "天使機構-執行部魂救済課。" },
  { id: 52, title: "Pro Jank Footy", booth: "1F-D52", floor: "1F", exhibitor: "Powerbomb Games", genre: "スポーツ", description: "ジャンクサッカー。" },
  { id: 53, title: "BBアドベンチャー (BB Adventure)", booth: "1F-D53", floor: "1F", exhibitor: "やまむーゲームス", genre: "アクション", description: "アクション×スポーツ。Switch/Steam対応。" },
  { id: 54, title: "THREAT -SCREAM AND ESCAPE-", booth: "1F-D54", floor: "1F", exhibitor: "C-Route,inc.", genre: "ホラー", description: "ホラー脱出ゲーム。" },
  { id: 55, title: "Tammuz: Blood and Sand", booth: "1F-D55", floor: "1F", exhibitor: "Bad Goat & CloverBite", genre: "アクション", description: "Tammuz: 血と砂。" },
  { id: 56, title: "妄想ゲームズ☆ ブース", booth: "1F-U01", floor: "1F", exhibitor: "妄想ゲームズ☆", genre: "ボードゲーム", description: "ボードゲーム出展ブース。" },
  { id: 57, title: "HEY! ブース", booth: "1F-U02", floor: "1F", exhibitor: "HEY!", genre: "ボードゲーム", description: "ボードゲーム出展ブース。" },
  { id: 58, title: "らいるず & ダックルーズ ブース", booth: "1F-U03", floor: "1F", exhibitor: "らいるず & ダックルーズ", genre: "ボードゲーム", description: "ボードゲーム出展ブース。" },
  { id: 59, title: "ClaGla ブース", booth: "1F-U04", floor: "1F", exhibitor: "ClaGla（クラグラ）", genre: "ボードゲーム", description: "札幌発のボードゲームメーカー。新作謎解きゲームをBitSummitで先行販売。" },
  { id: 60, title: "SUSABI Games & Virtual Party ブース", booth: "1F-U05", floor: "1F", exhibitor: "SUSABI Games & Virtual Party", genre: "ボードゲーム", description: "ボードゲーム出展ブース。" },
  { id: 61, title: "淺草ゲームズ ブース", booth: "1F-U06", floor: "1F", exhibitor: "淺草ゲームズ", genre: "ボードゲーム", description: "ボードゲーム出展ブース。" },
  { id: 62, title: "TANSAN & ハーベストバレー ブース", booth: "1F-U07", floor: "1F", exhibitor: "TANSAN & ハーベストバレー", genre: "ボードゲーム", description: "ボードゲーム出展ブース。" },
  { id: 63, title: "京都市 ブース", booth: "1F-C01", floor: "1F", exhibitor: "京都市", genre: "その他", description: "京都市のパートナーブース。" },
  { id: 64, title: "京都府 ブース", booth: "1F-C02", floor: "1F", exhibitor: "京都府", genre: "その他", description: "京都府のパートナーブース。" },
  { id: 65, title: "京まふ ブース", booth: "1F-C03", floor: "1F", exhibitor: "京都国際マンガ・アニメフェア", genre: "その他", description: "京都国際マンガ・アニメフェアのPRブース。" },
  { id: 66, title: "CAMPFIRE ブース", booth: "1F-C04", floor: "1F", exhibitor: "CAMPFIRE", genre: "その他", description: "クラウドファンディングサービスのブース。" },
  { id: 67, title: "BitSummit 公式物販ブース", booth: "1F-E01", floor: "1F", exhibitor: "BitSummit", genre: "その他", description: "公式グッズ販売エリア。" },
  { id: 68, title: "fYtO 物販", booth: "1F-E02", floor: "1F", exhibitor: "株式会社フロムイエロートゥオレンジ", genre: "その他", description: "物販ブース。" },
  { id: 69, title: "SUPERDELUXE GAMES 物販", booth: "1F-E03", floor: "1F", exhibitor: "SUPERDELUXE GAMES", genre: "その他", description: "物販ブース。" },
  { id: 70, title: "エディットモード 物販", booth: "1F-E04", floor: "1F", exhibitor: "エディットモード", genre: "その他", description: "物販ブース。" },
  { id: 71, title: "玉乃光酒造 飲食", booth: "1F-E05", floor: "1F", exhibitor: "玉乃光酒造", genre: "その他", description: "京都の地酒を販売。" },
  { id: 72, title: "BAKERU 飲食", booth: "1F-E06", floor: "1F", exhibitor: "BAKERU", genre: "その他", description: "飲食ブース。" },
  { id: 73, title: "淺草来々軒 飲食", booth: "1F-E07", floor: "1F", exhibitor: "淺草来々軒", genre: "その他", description: "ラーメンの飲食ブース。" },
  { id: 74, title: "スティッチコーヒー 飲食", booth: "1F-E08", floor: "1F", exhibitor: "スティッチコーヒー", genre: "その他", description: "コーヒー飲食ブース。" },
  { id: 75, title: "58DINER 飲食", booth: "1F-E09", floor: "1F", exhibitor: "58DINER", genre: "その他", description: "ダイナースタイルの飲食ブース。" },
  { id: 76, title: "ギルドバハムートIII 飲食", booth: "1F-E10", floor: "1F", exhibitor: "ギルドバハムートIII", genre: "その他", description: "ファンタジー系コンセプトの飲食販売。" },
  { id: 77, title: "Devolver Digital ブース", booth: "1F-A01", floor: "1F", exhibitor: "Devolver Digital", genre: "その他", description: "Devolver Digital出展ブース。" },
  { id: 78, title: "インティ・クリエイツ ブース", booth: "1F-A02", floor: "1F", exhibitor: "インティ・クリエイツ", genre: "アクション", description: "白き鋼鉄のX 1+2 デュアルコレクション、魔女ガミ、ぼくらのキングダム、蒼き雷霆 ガンヴォルトを試遊出展。" },
  { id: 79, title: "KOCCA ブース", booth: "1F-A03", floor: "1F", exhibitor: "KOCCA", genre: "その他", description: "韓国コンテンツ振興院（KOCCA）のブース。" },
  { id: 80, title: "ハピネット ブース", booth: "1F-A04", floor: "1F", exhibitor: "株式会社ハピネット", genre: "アドベンチャー", description: "Tokyo Stories、Stray (Switch 2版)、Apopia、モノノケの国、アーティスインパクトなどを出展。" },
  { id: 81, title: "NZ CODE ブース", booth: "1F-A05", floor: "1F", exhibitor: "NZ CODE", genre: "その他", description: "ニュージーランドのゲーム企業ブース。" },
  { id: 82, title: "ポケットペア ブース", booth: "1F-A06", floor: "1F", exhibitor: "ポケットペア", genre: "アクション", description: "Palworldの開発元。最新タイトル等の試遊出展予定。" },
  { id: 83, title: "Screen Australia ブース", booth: "1F-A07", floor: "1F", exhibitor: "Screen Australia", genre: "その他", description: "オーストラリアのスクリーン産業政府機関のブース。" },
  { id: 84, title: "Kakehashi Games ブース", booth: "1F-A08", floor: "1F", exhibitor: "Kakehashi Games", genre: "その他", description: "Kakehashi Gamesの出展ブース。" },
  { id: 85, title: "Game Source Entertainment ブース", booth: "1F-A09", floor: "1F", exhibitor: "GAME SOURCE ENTERTAINMENT", genre: "アクション", description: "ラタタン (Switch 2版)、電車アタック、THANKS, LIGHT.などを出展。" },
  { id: 86, title: "電ファミニコゲーマー ブース", booth: "1F-A10", floor: "1F", exhibitor: "電ファミニコゲーマー", genre: "その他", description: "ゲームメディアのブース。" },
  { id: 87, title: "Q-Games ブース", booth: "1F-A11", floor: "1F", exhibitor: "Q-Games", genre: "アクション", description: "PixelJunkシリーズで知られるQ-Gamesのブース。" },
  { id: 88, title: "Critical Reflex ブース", booth: "1F-A12", floor: "1F", exhibitor: "Critical Reflex", genre: "シミュレーション", description: "Graveyard Keeper 2など。棺桶に寝そべりながら体験プレイできるユニークな展示あり。" },
  { id: 89, title: "Ukiyo Studios ブース", booth: "1F-A13", floor: "1F", exhibitor: "Ukiyo Studios", genre: "アドベンチャー", description: "Tanuki: Pon's Summer、No, I'm not a Human、Inkblood、Cucina Stellata、Altered Alma、Being & Becomingなど。" },
  { id: 90, title: "PARCO GAMES ブース", booth: "1F-A14", floor: "1F", exhibitor: "PARCO GAMES", genre: "その他", description: "パルコゲームズの出展ブース。" },
  { id: 91, title: "viviON ブース", booth: "1F-A15", floor: "1F", exhibitor: "株式会社viviON", genre: "その他", description: "viviONの出展ブース。" },
  { id: 92, title: "2P Games ブース", booth: "1F-A16", floor: "1F", exhibitor: "2P Games", genre: "その他", description: "2P Gamesの出展ブース。" },
  { id: 93, title: "G-SMASH ブース", booth: "1F-A17", floor: "1F", exhibitor: "G-SMASH株式会社", genre: "その他", description: "G-SMASHの出展ブース。" },
  { id: 94, title: "G-SMASH GAMEJAM", booth: "1F-A18", floor: "1F", exhibitor: "G-SMASH GAMEJAM", genre: "その他", description: "G-SMASH主催のゲームジャム展示。" },
  { id: 95, title: "ドリコム ブース", booth: "1F-A19", floor: "1F", exhibitor: "株式会社ドリコム", genre: "その他", description: "ドリコムの出展ブース。" },
  { id: 96, title: "tinyBuild ブース", booth: "1F-A20", floor: "1F", exhibitor: "tinyBuild", genre: "その他", description: "tinyBuildの出展ブース。" },
  { id: 97, title: "New Blood ブース", booth: "1F-A21", floor: "1F", exhibitor: "New Blood Interactive", genre: "ホラー", description: "Dungeons of Dusk、Tenebris Somniaなどを出展。" },
  { id: 98, title: "CRI・ミドルウェア ブース", booth: "1F-A22", floor: "1F", exhibitor: "株式会社CRI・ミドルウェア", genre: "その他", description: "ゲーム開発ミドルウェアのブース。" },
  { id: 99, title: "CiGA ブース", booth: "1F-A23", floor: "1F", exhibitor: "CiGA（China indie Game Alliance）", genre: "その他", description: "中国インディーゲーム連盟のブース。" },
  { id: 100, title: "アニプレックス ブース", booth: "1F-A24", floor: "1F", exhibitor: "アニプレックス", genre: "その他", description: "アニプレックスの出展ブース。" },
  { id: 101, title: "東映ゲームズ ブース", booth: "1F-A25", floor: "1F", exhibitor: "東映ゲームズ", genre: "アクション", description: "KILLA、HINO、DEBUG NEPHEMEEを出展。試遊でオリジナルクリアカードプレゼント。" },
  { id: 102, title: "マーベラス ブース", booth: "1F-A26", floor: "1F", exhibitor: "マーベラス", genre: "アドベンチャー", description: "iGi発タイトルなどを出展。" },
  { id: 103, title: "iGi indie Game incubator ブース", booth: "1F-A27", floor: "1F", exhibitor: "iGi indie Game incubator", genre: "その他", description: "iGiインキュベーション参加スタジオの紹介。" },
  { id: 104, title: "INDIENOVA ブース", booth: "1F-B01", floor: "1F", exhibitor: "INDIENOVA", genre: "その他", description: "INDIENOVAの出展ブース。" },
  { id: 105, title: "スピード ブース", booth: "1F-B02", floor: "1F", exhibitor: "株式会社スピード", genre: "その他", description: "スピードの出展ブース。" },
  { id: 106, title: "ウルクスヘブン ブース", booth: "1F-B03", floor: "1F", exhibitor: "有限会社ウルクスヘブン", genre: "その他", description: "ウルクスヘブンの出展ブース。" },
  { id: 107, title: "松竹 ブース", booth: "1F-B04", floor: "1F", exhibitor: "松竹株式会社", genre: "その他", description: "松竹の出展ブース。" },
  { id: 108, title: "CharacterBank ブース", booth: "1F-B05", floor: "1F", exhibitor: "株式会社CharacterBank", genre: "アクション", description: "Knights of Fiona ~フィオナ騎士団~。京都発VRマルチプレイアクションRPG。" },
  { id: 109, title: "Black Lantern Collective ブース", booth: "1F-B06", floor: "1F", exhibitor: "Black Lantern Collective", genre: "ホラー", description: "KOPERNICUS、Sucker for Love: Crush Landingを出展。" },
  { id: 110, title: "SKOOTA GAMES ブース", booth: "1F-B07", floor: "1F", exhibitor: "SKOOTA GAMES", genre: "その他", description: "SKOOTA GAMESの出展ブース。" },
  { id: 111, title: "SUNSOFT ブース", booth: "1F-B08", floor: "1F", exhibitor: "SUNSOFT（サン電子）", genre: "ストラテジー", description: "HARD EDGE TACTICS、GAME 鑑定士などを出展。来場者プレゼント企画あり。" },
  { id: 112, title: "Pikii ブース", booth: "1F-B09", floor: "1F", exhibitor: "Pikii", genre: "その他", description: "Pikiiの出展ブース。" },
  { id: 113, title: "パイオニア ブース", booth: "1F-B10", floor: "1F", exhibitor: "パイオニア", genre: "その他", description: "パイオニアの出展ブース。" },
  { id: 114, title: "達成電器 ブース", booth: "1F-B11", floor: "1F", exhibitor: "達成電器", genre: "その他", description: "達成電器の出展ブース。" },
  { id: 115, title: "ヤネウラゲームス ブース", booth: "1F-B12", floor: "1F", exhibitor: "株式会社ヤネウラゲームス", genre: "その他", description: "ヤネウラゲームスの出展ブース。" },
  { id: 116, title: "ホビージャパン ブース", booth: "1F-B13", floor: "1F", exhibitor: "ホビージャパン", genre: "その他", description: "ホビージャパンの出展ブース。" },
  { id: 117, title: "ジー・モード ブース", booth: "1F-B14", floor: "1F", exhibitor: "ジー・モード", genre: "アドベンチャー", description: "みんなで空気読み。ワールド タイVer.、コメンテーター、配信少女ノ裏垢迷宮を出展。" },
  { id: 118, title: "room6 ブース", booth: "1F-B15", floor: "1F", exhibitor: "room6 / ヨカゼ", genre: "アドベンチャー", description: "Thunder of the DemonKing、UNDERGROUNDED、アンリアルライフ、ヨカゼレーベル作品など。" },
  { id: 119, title: "Silkroad Studios ブース", booth: "1F-B16", floor: "1F", exhibitor: "Silkroad Studios", genre: "その他", description: "Silkroad Studiosの出展ブース。" },
  { id: 120, title: "ラディアスリー ブース", booth: "1F-B17", floor: "1F", exhibitor: "ラディアスリー株式会社", genre: "その他", description: "ラディアスリーの出展ブース。" },
  { id: 121, title: "CRAFTS&MEISTER ブース", booth: "1F-B18", floor: "1F", exhibitor: "株式会社CRAFTS&MEISTER", genre: "その他", description: "CRAFTS&MEISTERの出展ブース。" },
  { id: 122, title: "AssetHub ブース", booth: "1F-B19", floor: "1F", exhibitor: "AssetHub Inc.", genre: "その他", description: "AssetHubの出展ブース。" },
  { id: 123, title: "電羊法律事務所 ブース", booth: "1F-B20", floor: "1F", exhibitor: "電羊法律事務所", genre: "その他", description: "ゲーム業界向け法律事務所のブース。" },
  { id: 124, title: "イースニッド ブース", booth: "1F-B21", floor: "1F", exhibitor: "イースニッド", genre: "その他", description: "イースニッドの出展ブース。" },
  { id: 125, title: "GameMaker ブース", booth: "1F-B22", floor: "1F", exhibitor: "GameMaker", genre: "その他", description: "ゲーム開発エンジンGameMakerのブース。" },
  { id: 126, title: "SuperDuperSecret ブース", booth: "1F-B23", floor: "1F", exhibitor: "SuperDuperSecret Co.", genre: "その他", description: "SuperDuperSecretの出展ブース。" },
  { id: 127, title: "R/GA ブース", booth: "1F-B24", floor: "1F", exhibitor: "R/GA", genre: "その他", description: "R/GAの出展ブース。" },
  { id: 128, title: "Zandbox Studio ブース", booth: "1F-B25", floor: "1F", exhibitor: "Zandbox Studio", genre: "その他", description: "Zandbox Studioの出展ブース。" },
  { id: 129, title: "トムス・エンタテインメント ブース", booth: "1F-B26", floor: "1F", exhibitor: "トムス・エンタテインメント", genre: "その他", description: "トムスの出展ブース。" },
  { id: 130, title: "Blue Backpack ブース", booth: "1F-B27", floor: "1F", exhibitor: "Blue Backpack", genre: "その他", description: "Blue Backpackの出展ブース。" },
  { id: 131, title: "Yellow Hearts ブース", booth: "1F-B28", floor: "1F", exhibitor: "Yellow Hearts", genre: "その他", description: "Yellow Heartsの出展ブース。" },
  { id: 132, title: "ジュピター ブース", booth: "1F-B29", floor: "1F", exhibitor: "株式会社ジュピター", genre: "その他", description: "ジュピターの出展ブース。" },
  { id: 133, title: "スクウェア・エニックス ブース", booth: "1F-B30", floor: "1F", exhibitor: "スクウェア・エニックス", genre: "その他", description: "スクウェア・エニックスの出展ブース。" },
  { id: 134, title: "KARATE ROGUE", booth: "3F-D01", floor: "3F", exhibitor: "terry-do GAMES", genre: "アクション", description: "空手をテーマにしたローグライクアクション。" },
  { id: 135, title: "Capy Castaway", booth: "3F-D02", floor: "3F", exhibitor: "Kitten Cup Studio", genre: "アドベンチャー", description: "カピバラ漂流物語。" },
  { id: 136, title: "Vikings On Trampolines", booth: "3F-D03", floor: "3F", exhibitor: "D-Pad Studio", genre: "アクション", description: "トランポリンに乗るバイキングのアクション。" },
  { id: 137, title: "クワイエット急行909号室 (Quiet Express: Cabin 909)", booth: "3F-D04", floor: "3F", exhibitor: "STUDIO909 LLC", genre: "アドベンチャー", description: "クワイエット急行909号室。" },
  { id: 138, title: "Weatherium", booth: "3F-D05", floor: "3F", exhibitor: "Pokeso", genre: "シミュレーション", description: "天候をテーマにしたゲーム。" },
  { id: 139, title: "Let's Build a Dungeon", booth: "3F-D06", floor: "3F", exhibitor: "Springloaded", genre: "シミュレーション", description: "ダンジョン構築シミュレーション。" },
  { id: 140, title: "Spellbrush's Tactical Game", booth: "3F-D07", floor: "3F", exhibitor: "Spellbrush", genre: "ストラテジー", description: "Spellbrush開発のタクティカルゲーム。" },
  { id: 141, title: "Cogito:Requiem", booth: "3F-D08", floor: "3F", exhibitor: "SPECTACLE", genre: "アドベンチャー", description: "認知をテーマにしたアドベンチャー。" },
  { id: 142, title: "High Fructose", booth: "3F-D09", floor: "3F", exhibitor: "Chazak Games", genre: "アクション", description: "High Fructose。" },
  { id: 143, title: "BlueLine", booth: "3F-D10", floor: "3F", exhibitor: "Going Places Studio", genre: "アクション", description: "BlueLine。" },
  { id: 144, title: "めくるりウィッチ (Mekururi)", booth: "3F-D11", floor: "3F", exhibitor: "SleepingMuseum", genre: "パズル", description: "めくるりウィッチ。" },
  { id: 145, title: "JIGENRO (次元獄)", booth: "3F-D12", floor: "3F", exhibitor: "㊥Maruchu", genre: "アクション", description: "次元獄。" },
  { id: 146, title: "Surfpunk", booth: "3F-D13", floor: "3F", exhibitor: "Double Stallion", genre: "アクション", description: "サーファーパイレーツの1〜4人協力プレイ対応サーフ＆スラッシュ。" },
  { id: 147, title: "The Remake of the End of the Greatest RPG of All Time", booth: "3F-D14", floor: "3F", exhibitor: "Coin Drop Games", genre: "RPG", description: "最高のRPGのリメイク。" },
  { id: 148, title: "スターレス・アンブラ (Starless Umbra)", booth: "3F-D15", floor: "3F", exhibitor: "Alcuria Games", genre: "アドベンチャー", description: "スターレス・アンブラ。" },
  { id: 149, title: "Handlime", booth: "3F-D16", floor: "3F", exhibitor: "BONJORY – Creative Studio at Kyoto Institute of Technology", genre: "その他", description: "京都工繊大のクリエイティブ作品。" },
  { id: 150, title: "新年3秒前 (3 seconds before new year)", booth: "3F-D17", floor: "3F", exhibitor: "Nippon Engineering Education College", genre: "アドベンチャー", description: "新年3秒前。" },
  { id: 151, title: "ミッドナイトホード (Midnight Horde)", booth: "3F-D18", floor: "3F", exhibitor: "Carry Castle", genre: "アクション", description: "ミッドナイトホード。" },
  { id: 152, title: "Cosmic Race: Galactic Showdown", booth: "3F-D19", floor: "3F", exhibitor: "Psypher Interactive", genre: "レーシング", description: "アクション×レーシング×スポーツ。Switch/PC/PS5/Xbox対応。" },
  { id: 153, title: "MOP'N SPARK", booth: "3F-D20", floor: "3F", exhibitor: "Omoplata Games", genre: "アクション", description: "MOP'N SPARK。" },
  { id: 154, title: "Mount Lomyst (ロミスト山のてっぺん)", booth: "3F-D21", floor: "3F", exhibitor: "Hiko Game", genre: "アクション", description: "ロミスト山のてっぺん。" },
  { id: 155, title: "Fishbowl", booth: "3F-D22", floor: "3F", exhibitor: "imissmyfriends.studio", genre: "アドベンチャー", description: "金魚鉢の物語。" },
  { id: 156, title: "Syndream", booth: "3F-D23", floor: "3F", exhibitor: "UGONOSTUDIO", genre: "アドベンチャー", description: "夢を共有する物語。" },
  { id: 157, title: "Corebreaker (核元突破！)", booth: "3F-D24", floor: "3F", exhibitor: "aQuadiun", genre: "アクション", description: "核元突破！。" },
  { id: 158, title: "The Little Tomb: The Maholova Club and the Search for a Dead Body", booth: "3F-D25", floor: "3F", exhibitor: "CAVYHOUSE", genre: "アドベンチャー", description: "リトル・トゥーム：マホロバ倶楽部の死体探し。" },
  { id: 159, title: "プロジェクト・ソラリス (Project・Solaris)", booth: "3F-D26", floor: "3F", exhibitor: "GREENHORN.LLC", genre: "アドベンチャー", description: "プロジェクト・ソラリス。" },
  { id: 160, title: "NIGHTMARE OPERATOR", booth: "3F-D27", floor: "3F", exhibitor: "DDDistortion", genre: "ホラー", description: "悪夢のオペレーター。" },
  { id: 161, title: "Light Odyssey", booth: "3F-D28", floor: "3F", exhibitor: "SSUN GAMES", genre: "アドベンチャー", description: "光のオデッセイ。" },
  { id: 162, title: "DEATH A LIVE", booth: "3F-D29", floor: "3F", exhibitor: "Rabbit Trigger", genre: "アクション", description: "アクション×アドベンチャー×リズム。Steam対応。" },
  { id: 163, title: "One Song, One Life", booth: "3F-D30", floor: "3F", exhibitor: "C-Route,inc.", genre: "音楽", description: "1曲、1つの人生。" },
  { id: 164, title: "Gutsy Grid (ガッツィ・グリッド)", booth: "3F-D31", floor: "3F", exhibitor: "Team Gutsy", genre: "パズル", description: "ガッツィ・グリッド。" },
  { id: 165, title: "無限武者 (ENDLESS SAMURAI)", booth: "3F-D32", floor: "3F", exhibitor: "Montblanc Hatch", genre: "アクション", description: "無限武者。" },
  { id: 166, title: "Sloppy Forgeries", booth: "3F-D33", floor: "3F", exhibitor: "Playful Systems", genre: "その他", description: "雑な贋作。" },
  { id: 167, title: "Bashful Adoration (魔女たちの恋戦争)", booth: "3F-D34", floor: "3F", exhibitor: "KittyWampus", genre: "アドベンチャー", description: "バッシュフル-魔女たちの恋戦争。" },
  { id: 168, title: "NEXUS CODE", booth: "3F-D35", floor: "3F", exhibitor: "IoliteGames", genre: "アクション", description: "NEXUS CODE。" },
  { id: 169, title: "Hermit Computer", booth: "3F-D36", floor: "3F", exhibitor: "Visual Interactive Arts (VIA studio)", genre: "アドベンチャー", description: "ハーミットコンピューター。" },
  { id: 170, title: "HellHeart Breaker", booth: "3F-D37", floor: "3F", exhibitor: "BattleBrew Productions", genre: "アクション", description: "ハートを砕くアクション。" },
  { id: 171, title: "Ghost Vanguard", booth: "3F-D38", floor: "3F", exhibitor: "WOMBO COMBO GAMES INC.", genre: "アクション", description: "ゴーストヴァンガード。" },
  { id: 172, title: "Sushi Loop Licker", booth: "3F-D39", floor: "3F", exhibitor: "SLL Team", genre: "その他", description: "寿司ループリッカー。" },
  { id: 173, title: "夢閃少女 (Awaking Beauty)", booth: "3F-D40", floor: "3F", exhibitor: "YOHCAN Co., Ltd.", genre: "アクション", description: "アクション×ローグライク。ローカルマルチ対応。Steam対応。" },
  { id: 174, title: "バイト・ファイト！！：パートタイム・魔物ハンター", booth: "3F-D41", floor: "3F", exhibitor: "KINGOFSHIBUYA Ltd.", genre: "アクション", description: "バイト・ファイト！！：パートタイム・魔物ハンター。" },
  { id: 175, title: "MAPS (My Apocalyptic Plan for Survival)", booth: "3F-D42", floor: "3F", exhibitor: "Stumpysquid AB", genre: "シミュレーション", description: "終末生存計画。" },
  { id: 176, title: "セラフィーヌは空を行く (Seraphine's Skyward Journey)", booth: "3F-D43", floor: "3F", exhibitor: "Mizukagami Studio", genre: "アクション", description: "セラフィーヌは空を行く。" },
  { id: 177, title: "レジーといとこ＋科学者x2この世の終わり！？", booth: "3F-D44", floor: "3F", exhibitor: "degoma", genre: "アドベンチャー", description: "レジーといとこ＋科学者x2この世の終わり！？。" },
  { id: 178, title: "おデの巣穴でレベル上げなんてさせない", booth: "3F-D45", floor: "3F", exhibitor: "Pomuya", genre: "RPG", description: "おデの巣穴でレベル上げなんてさせない。" },
  { id: 179, title: "ヅララララッシュ (ZURARARARUSH!!!)", booth: "3F-D46", floor: "3F", exhibitor: "Appare Factory,LLC", genre: "アクション", description: "ヅララララッシュ。" },
  { id: 180, title: "ゲームショップ斜陽 (Sunset Game Shop Shayou)", booth: "3F-D47", floor: "3F", exhibitor: "Lob studio Inc.", genre: "シミュレーション", description: "ゲームショップ斜陽。" },
  { id: 181, title: "DEAREND", booth: "3F-D48", floor: "3F", exhibitor: "KUROSAWA CREATE", genre: "シューティング", description: "アクションシューター。Steam対応。" },
  { id: 182, title: "Conductus", booth: "3F-D49", floor: "3F", exhibitor: "Team「Reverberate」", genre: "音楽", description: "コンダクタス。" },
  { id: 183, title: "YaoyoroZOO (八百万動物園)", booth: "3F-D50", floor: "3F", exhibitor: "AlSH", genre: "シミュレーション", description: "八百万動物園。" },
  { id: 184, title: "行列のできる武器鍛冶屋 (Line Forge BlackSmith)", booth: "3F-D51", floor: "3F", exhibitor: "KansyaGames", genre: "シミュレーション", description: "行列のできる武器鍛冶屋。" },
  { id: 185, title: "ロープくんアドベンチャー (Rope-Kun Adventure)", booth: "3F-D52", floor: "3F", exhibitor: "Kei26", genre: "アクション", description: "ロープくんアドベンチャー。" },
  { id: 186, title: "Dyping Escape", booth: "3F-D53", floor: "3F", exhibitor: "Heaviside Creations", genre: "アクション", description: "Dyping Escape。" },
  { id: 187, title: "ロスト＆ファウンドCo. (Lost and Found Co.)", booth: "3F-D54", floor: "3F", exhibitor: "Bit Egg Inc.", genre: "アドベンチャー", description: "ロスト＆ファウンドCo.。" },
  { id: 188, title: "Dancing with Ghosts", booth: "3F-D55", floor: "3F", exhibitor: "HumaNature Studios", genre: "アクション", description: "幽霊と踊る。" },
  { id: 189, title: "Cento", booth: "3F-D56", floor: "3F", exhibitor: "Hoshimadara Lab.", genre: "アドベンチャー", description: "Cento。" },
  { id: 190, title: "Calling", booth: "3F-D57", floor: "3F", exhibitor: "MatsuOkaGumi", genre: "アドベンチャー", description: "Calling。" },
  { id: 191, title: "502号室：寄宿学校青春ミステリー (Room 502)", booth: "3F-D58", floor: "3F", exhibitor: "LOTS", genre: "アドベンチャー", description: "502号室：寄宿学校青春ミステリー。Steam対応。" },
  { id: 192, title: "Own Time Own Target", booth: "3F-D59", floor: "3F", exhibitor: "No Average Joe", genre: "シューティング", description: "オウンタイムオウンターゲット。" },
  { id: 193, title: "Addie Shen", booth: "3F-D60", floor: "3F", exhibitor: "Unexpected Accessories", genre: "アドベンチャー", description: "アディ・シェン。" },
  { id: 194, title: "オンエア！タクシー探偵事件簿 (On Air! Taxi Detective Casebook)", booth: "3F-D61", floor: "3F", exhibitor: "373 STUDIO", genre: "アドベンチャー", description: "オンエア！タクシー探偵事件簿。" },
  { id: 195, title: "忍者ゲーム (Ninja Game)", booth: "3F-D62", floor: "3F", exhibitor: "kusoge00", genre: "アクション", description: "忍者ゲーム。" },
  { id: 196, title: "プリッとプリズナー (Pritto Prisoner)", booth: "3F-D63", floor: "3F", exhibitor: "PinCool, Inc.", genre: "アクション", description: "プリッとプリズナー。" },
  { id: 197, title: "ブラス・クーバスの死後依頼 (The Posthumous Investigation)", booth: "3F-D64", floor: "3F", exhibitor: "Infini Fun", genre: "アドベンチャー", description: "ブラス・クーバスの死後依頼。" },
  { id: 198, title: "FEAR FA 98™", booth: "3F-D65", floor: "3F", exhibitor: "Jacob Jazz", genre: "ホラー", description: "FEAR FA 98。" },
  { id: 199, title: "リクイッド・アビス (The Melted Jelly)", booth: "3F-D66", floor: "3F", exhibitor: "Hello Quest", genre: "アドベンチャー", description: "リクイッド・アビス。" },
  { id: 200, title: "inKONBINI -One Store. Many Stories.-", booth: "3F-D67", floor: "3F", exhibitor: "Beep Japan Inc", genre: "アドベンチャー", description: "コンビニ店員シミュレーター。" },
  { id: 201, title: "ANTONBLAST", booth: "3F-D68", floor: "3F", exhibitor: "Summitsphere", genre: "アクション", description: "アクションアドベンチャー。Steam対応。" },
  { id: 202, title: "StarVaders", booth: "3F-D69", floor: "3F", exhibitor: "Pengonauts", genre: "シューティング", description: "スターベーダーズ。" },
  { id: 203, title: "Enter the Chronosphere", booth: "3F-D70", floor: "3F", exhibitor: "Effort Star", genre: "アクション", description: "クロノスフィアに入る。" },
  { id: 204, title: "東京工芸大学ゲーム学科 (U01)", booth: "3F-U01", floor: "3F", exhibitor: "東京工芸大学ゲーム学科", genre: "その他", description: "特殊デバイス展示。" },
  { id: 205, title: "東京工芸大学ゲーム学科 (U02)", booth: "3F-U02", floor: "3F", exhibitor: "東京工芸大学ゲーム学科", genre: "その他", description: "特殊デバイス展示。" },
  { id: 206, title: "東京工芸大学ゲーム学科 (U03)", booth: "3F-U03", floor: "3F", exhibitor: "東京工芸大学ゲーム学科", genre: "その他", description: "特殊デバイス展示。" },
  { id: 207, title: "東京工芸大学ゲーム学科 (U04)", booth: "3F-U04", floor: "3F", exhibitor: "東京工芸大学ゲーム学科", genre: "その他", description: "特殊デバイス展示。" },
  { id: 208, title: "しゅんて ブース", booth: "3F-U05", floor: "3F", exhibitor: "しゅんて", genre: "その他", description: "特殊デバイス展示。" },
  { id: 209, title: "サメ ブース", booth: "3F-U06", floor: "3F", exhibitor: "サメ", genre: "その他", description: "特殊デバイス展示。" },
  { id: 210, title: "ニアピンGOプロジェクト", booth: "3F-U07", floor: "3F", exhibitor: "ニアピンGOプロジェクト", genre: "その他", description: "特殊デバイス展示。" },
  { id: 211, title: "愛知工業大学CGメディア研究室 (U08)", booth: "3F-U08", floor: "3F", exhibitor: "愛知工業大学CGメディア研究室", genre: "その他", description: "特殊デバイス展示。" },
  { id: 212, title: "東京工芸大学ゲーム学科 (U09)", booth: "3F-U09", floor: "3F", exhibitor: "東京工芸大学ゲーム学科", genre: "その他", description: "特殊デバイス展示。" },
  { id: 213, title: "東京工芸大学ゲーム学科 (U10)", booth: "3F-U10", floor: "3F", exhibitor: "東京工芸大学ゲーム学科", genre: "その他", description: "特殊デバイス展示。" },
  { id: 214, title: "東京工芸大学ゲーム学科 (U11)", booth: "3F-U11", floor: "3F", exhibitor: "東京工芸大学ゲーム学科", genre: "その他", description: "特殊デバイス展示。" },
  { id: 215, title: "東京工芸大学ゲーム学科 (U12)", booth: "3F-U12", floor: "3F", exhibitor: "東京工芸大学ゲーム学科", genre: "その他", description: "特殊デバイス展示。" },
  { id: 216, title: "東京工芸大学ゲーム学科 (U13)", booth: "3F-U13", floor: "3F", exhibitor: "東京工芸大学ゲーム学科", genre: "その他", description: "特殊デバイス展示。" },
  { id: 217, title: "ドイノブヒロ ブース", booth: "3F-U14", floor: "3F", exhibitor: "ドイノブヒロ", genre: "その他", description: "特殊デバイス展示。" },
  { id: 218, title: "E班（Electronics班）", booth: "3F-U15", floor: "3F", exhibitor: "E班（Electronics班）", genre: "その他", description: "特殊デバイス展示。" },
  { id: 219, title: "讃岐GameN", booth: "3F-U16", floor: "3F", exhibitor: "讃岐GameN", genre: "その他", description: "特殊デバイス展示。" },
  { id: 220, title: "チームゲハナシ", booth: "3F-U17", floor: "3F", exhibitor: "チームゲハナシ", genre: "その他", description: "特殊デバイス展示。" },
  { id: 221, title: "映画の清掃員", booth: "3F-U18", floor: "3F", exhibitor: "映画の清掃員", genre: "その他", description: "特殊デバイス展示。" },
  { id: 222, title: "ネコマ製作所", booth: "3F-U19", floor: "3F", exhibitor: "ネコマ製作所", genre: "その他", description: "特殊デバイス展示。" },
  { id: 223, title: "ハードウェアとか研究所", booth: "3F-U20", floor: "3F", exhibitor: "ハードウェアとか研究所", genre: "その他", description: "特殊デバイス展示。" },
  { id: 224, title: "Interactive Materials Lab (U21)", booth: "3F-U21", floor: "3F", exhibitor: "Interactive Materials Lab", genre: "その他", description: "特殊デバイス展示。" },
  { id: 225, title: "Interactive Materials Lab (U22)", booth: "3F-U22", floor: "3F", exhibitor: "Interactive Materials Lab", genre: "その他", description: "特殊デバイス展示。" },
  { id: 226, title: "愛知工業大学CGメディア研究室・伊藤勇舞", booth: "3F-U23", floor: "3F", exhibitor: "愛知工業大学CGメディア研究室・伊藤勇舞", genre: "その他", description: "特殊デバイス展示。" },
  { id: 227, title: "シンプルファミリー", booth: "3F-U24", floor: "3F", exhibitor: "シンプルファミリー by Wonderland Kazakiri", genre: "その他", description: "特殊デバイス展示。" },
  { id: 228, title: "MIYAZAWORKS (U25)", booth: "3F-U25", floor: "3F", exhibitor: "MIYAZAWORKS", genre: "その他", description: "特殊デバイス展示。" },
  { id: 229, title: "UNUSE", booth: "3F-U26", floor: "3F", exhibitor: "UNUSE", genre: "その他", description: "特殊デバイス展示。" },
  { id: 230, title: "のへもん (U27)", booth: "3F-U27", floor: "3F", exhibitor: "のへもん", genre: "その他", description: "特殊デバイス展示。" },
  { id: 231, title: "Tamakotronica (U28)", booth: "3F-U28", floor: "3F", exhibitor: "Tamakotronica", genre: "その他", description: "特殊デバイス展示。" },
  { id: 232, title: "Wataru Nakano × MIYAZAWORKS", booth: "3F-U29", floor: "3F", exhibitor: "Wataru Nakano × MIYAZAWORKS", genre: "その他", description: "特殊デバイス展示。" },
  { id: 233, title: "のへもん (U30)", booth: "3F-U30", floor: "3F", exhibitor: "のへもん", genre: "その他", description: "特殊デバイス展示。" },
  { id: 234, title: "愛知工業大学CGメディア研究室 (U31)", booth: "3F-U31", floor: "3F", exhibitor: "愛知工業大学CGメディア研究室", genre: "その他", description: "特殊デバイス展示。" },
  { id: 235, title: "MIYAZAWORKS (U32)", booth: "3F-U32", floor: "3F", exhibitor: "MIYAZAWORKS", genre: "その他", description: "特殊デバイス展示。" },
  { id: 236, title: "Tamakotronica (U33)", booth: "3F-U33", floor: "3F", exhibitor: "Tamakotronica", genre: "その他", description: "特殊デバイス展示。" },
  { id: 237, title: "Skeleton Crew Studio / モリカトロン", booth: "3F-C01", floor: "3F", exhibitor: "Skeleton Crew Studio / モリカトロン", genre: "その他", description: "パートナーブース。" },
  { id: 238, title: "PYGMY STUDIO", booth: "3F-C02", floor: "3F", exhibitor: "PYGMY STUDIO", genre: "その他", description: "パートナーブース。" },
  { id: 239, title: "London Games Festival", booth: "3F-C03", floor: "3F", exhibitor: "London Games Festival", genre: "その他", description: "パートナーブース。" },
  { id: 240, title: "Games Ground", booth: "3F-C04", floor: "3F", exhibitor: "Games Ground", genre: "その他", description: "パートナーブース。" },
  { id: 241, title: "Gamirror Games", booth: "3F-C05", floor: "3F", exhibitor: "Gamirror Games", genre: "その他", description: "パートナーブース。" },
  { id: 242, title: "TAIWAN ACADEMIA INDUSTRY CONSORTIUM", booth: "3F-C06", floor: "3F", exhibitor: "TAIWAN ACADEMIA INDUSTRY CONSORTIUM", genre: "その他", description: "パートナーブース。" },
  { id: 243, title: "Taipei Game Show", booth: "3F-C07", floor: "3F", exhibitor: "Taipei Game Show", genre: "その他", description: "パートナーブース。" },
  { id: 244, title: "Day of the Devs", booth: "3F-C08", floor: "3F", exhibitor: "Day of the Devs", genre: "その他", description: "パートナーブース。" },
  { id: 245, title: "MIX", booth: "3F-C09", floor: "3F", exhibitor: "MIX", genre: "その他", description: "パートナーブース。" },
  { id: 246, title: "BIC Festival 2026", booth: "3F-C10", floor: "3F", exhibitor: "BIC Festival 2026", genre: "その他", description: "パートナーブース。" },
  { id: 247, title: "東京ゲームショウ", booth: "3F-C11", floor: "3F", exhibitor: "東京ゲームショウ", genre: "その他", description: "パートナーブース。" },
  { id: 248, title: "Game Grove X", booth: "3F-C12", floor: "3F", exhibitor: "Game Grove X", genre: "その他", description: "パートナーブース。" },
  { id: 249, title: "RCGS", booth: "3F-C13", floor: "3F", exhibitor: "RCGS", genre: "その他", description: "パートナーブース。" },
  { id: 250, title: "ホテル アンテルーム 京都", booth: "3F-C14", floor: "3F", exhibitor: "ホテル アンテルーム 京都", genre: "その他", description: "パートナーブース。" },
  { id: 251, title: "ZOTAC", booth: "3F-C15", floor: "3F", exhibitor: "ZOTAC", genre: "その他", description: "パートナーブース。" },
  { id: 252, title: "アスク", booth: "3F-C16", floor: "3F", exhibitor: "アスク", genre: "その他", description: "パートナーブース。" },
  { id: 253, title: "アウリン", booth: "3F-C17", floor: "3F", exhibitor: "アウリン", genre: "その他", description: "パートナーブース。" },
  { id: 254, title: "ウィットワン", booth: "3F-C18", floor: "3F", exhibitor: "ウィットワン", genre: "その他", description: "パートナーブース。" },
  { id: 255, title: "ブレインストーム", booth: "3F-C19", floor: "3F", exhibitor: "株式会社ブレインストーム", genre: "その他", description: "パートナーブース。" },
  { id: 256, title: "MIX STREAMING", booth: "3F-E01", floor: "3F", exhibitor: "MIX STREAMING", genre: "その他", description: "メディアブース。" },
  { id: 257, title: "G-EIGHT", booth: "3F-E02", floor: "3F", exhibitor: "G-EIGHT", genre: "その他", description: "メディアブース。" },
  { id: 258, title: "バハムート", booth: "3F-E03", floor: "3F", exhibitor: "バハムート", genre: "その他", description: "メディアブース。" },
  { id: 259, title: "IGN JAPAN", booth: "3F-E04", floor: "3F", exhibitor: "IGN JAPAN", genre: "その他", description: "メディアブース。" },
  { id: 260, title: "Catalan Institute for Cultural Companies", booth: "3F-A01", floor: "3F", exhibitor: "Catalan Institute for Cultural Companies - Catalan Arts", genre: "その他", description: "カタロニア文化産業協会のブース。" },
  { id: 261, title: "サードウェーブ / GALLERIA ブース", booth: "3F-A02", floor: "3F", exhibitor: "サードウェーブ / GALLERIA", genre: "その他", description: "GALLERIAブランドのゲーミングPC展示。" },
  { id: 262, title: "Sony Interactive Entertainment ブース", booth: "3F-A03", floor: "3F", exhibitor: "Sony Interactive Entertainment", genre: "その他", description: "プラチナスポンサー。" },
  { id: 263, title: "任天堂 ブース", booth: "3F-A04", floor: "3F", exhibitor: "任天堂株式会社", genre: "アドベンチャー", description: "Nintendo Switch 2でプレイ可能なインディータイトルを試遊出展。" },
  { id: 264, title: "集英社ゲームズ ブース", booth: "3F-A05", floor: "3F", exhibitor: "集英社ゲームズ", genre: "アドベンチャー", description: "シュレディンガーズ・コール、Chronoscript、BAKUDOなどを出展。" },
  { id: 265, title: "ジーン ブース", booth: "3F-A06", floor: "3F", exhibitor: "ジーン", genre: "その他", description: "ジーンの出展ブース。" },
  { id: 266, title: "WOW ブース", booth: "3F-A07", floor: "3F", exhibitor: "WOW", genre: "その他", description: "WOWの出展ブース。" },
  { id: 267, title: "ゲラッパ ブース", booth: "3F-A08", floor: "3F", exhibitor: "株式会社ゲラッパ", genre: "その他", description: "ゲラッパの出展ブース。" },
  { id: 268, title: "Lorebard ブース", booth: "3F-A09", floor: "3F", exhibitor: "Lorebard", genre: "その他", description: "Lorebardの出展ブース。" },
  { id: 269, title: "CE-Asia ブース", booth: "3F-A10", floor: "3F", exhibitor: "CE-Asia", genre: "その他", description: "CE-Asiaの出展ブース。" },
  { id: 270, title: "SEGA ブース", booth: "3F-A11", floor: "3F", exhibitor: "セガ", genre: "シミュレーション", description: "Outbound、盛世天下：女帝への道、リトルキティ・ビッグシティを出展。" },
  { id: 271, title: "東急不動産 ブース", booth: "3F-A12", floor: "3F", exhibitor: "東急不動産株式会社", genre: "その他", description: "東急不動産の出展ブース。" },
  { id: 272, title: "COREBLAZER ブース", booth: "3F-A13", floor: "3F", exhibitor: "COREBLAZER", genre: "シューティング", description: "詳細情報は会場にて。" },
  { id: 273, title: "Indie Games Pass ブース", booth: "3F-A14", floor: "3F", exhibitor: "Indie Games Pass (IGP)", genre: "その他", description: "複数インディータイトルを展示。" },
  { id: 274, title: "エヌビーゲームズ ブース", booth: "3F-A15", floor: "3F", exhibitor: "エヌビーゲームズ", genre: "その他", description: "エヌビーゲームズの出展ブース。" },
  { id: 275, title: "ブラックマジックデザイン ブース", booth: "3F-A16", floor: "3F", exhibitor: "ブラックマジックデザイン株式会社", genre: "その他", description: "ブラックマジックデザインの出展ブース。" },
  { id: 276, title: "日本ギガバイト ブース", booth: "3F-A17", floor: "3F", exhibitor: "日本ギガバイト株式会社", genre: "その他", description: "ギガバイトの出展ブース。" },
  { id: 277, title: "フリースタイル ブース", booth: "3F-A18", floor: "3F", exhibitor: "株式会社フリースタイル", genre: "その他", description: "フリースタイルの出展ブース。" },
  { id: 278, title: "Rice Games ブース", booth: "3F-A19", floor: "3F", exhibitor: "Rice Games Inc.", genre: "その他", description: "Rice Gamesの出展ブース。" },
  { id: 279, title: "サイバーエージェント ブース", booth: "3F-A20", floor: "3F", exhibitor: "株式会社サイバーエージェント", genre: "その他", description: "サイバーエージェントの出展ブース。" },
  { id: 280, title: "PixAI ブース", booth: "3F-A21", floor: "3F", exhibitor: "PixAI", genre: "その他", description: "PixAIの出展ブース。" },
  { id: 281, title: "大阪電気通信大学 ブース", booth: "3F-A22", floor: "3F", exhibitor: "大阪電気通信大学", genre: "その他", description: "大阪電気通信大学の出展ブース。" },
  { id: 282, title: "遊び創り研究センター ブース", booth: "3F-A23", floor: "3F", exhibitor: "遊び創り研究センター", genre: "その他", description: "遊び創り研究センターの出展ブース。" },
  { id: 283, title: "AREA 35 ブース", booth: "3F-A24", floor: "3F", exhibitor: "AREA 35", genre: "その他", description: "AREA 35の出展ブース。" },
  { id: 284, title: "WhisperGames ブース", booth: "3F-A25", floor: "3F", exhibitor: "WhisperGames", genre: "その他", description: "WhisperGamesの出展ブース。" },
  { id: 285, title: "Meshy AI ブース", booth: "3F-A26", floor: "3F", exhibitor: "Meshy AI", genre: "その他", description: "Meshy AIの出展ブース。" },
  { id: 286, title: "Indie-us Games ブース", booth: "3F-B01", floor: "3F", exhibitor: "Indie-us Games", genre: "その他", description: "Indie-us Gamesの出展ブース。" },
  { id: 287, title: "コーラス・ワールドワイド ブース", booth: "3F-B02", floor: "3F", exhibitor: "コーラス・ワールドワイド", genre: "その他", description: "コーラス・ワールドワイドの出展ブース。" },
  { id: 288, title: "17-BIT ブース", booth: "3F-B03", floor: "3F", exhibitor: "17-BIT", genre: "その他", description: "17-BITの出展ブース。" },
  { id: 289, title: "Black Tower Studios ブース", booth: "3F-B04", floor: "3F", exhibitor: "Black Tower Studios", genre: "その他", description: "Black Tower Studiosの出展ブース。" },
  { id: 290, title: "Graph ブース", booth: "3F-B05", floor: "3F", exhibitor: "Graph", genre: "RPG", description: "Aether & Iron、Be My Horde、Descent Of Lunaris、LOVE ETERNAL、Surfpunkを出展。" },
  { id: 291, title: "CANARY ISLANDS GAMES", booth: "3F-B06", floor: "3F", exhibitor: "CANARY ISLANDS GAMES", genre: "その他", description: "CANARY ISLANDS GAMESの出展ブース。" },
  { id: 292, title: "Toge Production ブース", booth: "3F-B07", floor: "3F", exhibitor: "Toge Production", genre: "その他", description: "Toge Productionの出展ブース。" },
  { id: 293, title: "Balor Games ブース", booth: "3F-B08", floor: "3F", exhibitor: "Balor Games", genre: "その他", description: "Balor Gamesの出展ブース。" },
  { id: 294, title: "あまた ブース", booth: "3F-B09", floor: "3F", exhibitor: "あまた株式会社", genre: "その他", description: "あまたの出展ブース。" },
  { id: 295, title: "大阪工業大学 ブース", booth: "3F-B10", floor: "3F", exhibitor: "大阪工業大学", genre: "その他", description: "大阪工業大学の出展ブース。" },
  { id: 296, title: "大阪情報コンピュータ専門学校", booth: "3F-B11", floor: "3F", exhibitor: "大阪情報コンピュータ専門学校", genre: "その他", description: "大阪情報コンピュータ専門学校の出展ブース。" },
  { id: 297, title: "京都デザイン&テクノロジー専門学校", booth: "3F-B12", floor: "3F", exhibitor: "京都デザイン&テクノロジー専門学校", genre: "その他", description: "京都デザイン&テクノロジー専門学校の出展ブース。" },
  { id: 298, title: "HYPER REAL ブース", booth: "3F-B13", floor: "3F", exhibitor: "HYPER REAL", genre: "その他", description: "HYPER REALの出展ブース。" },
  { id: 299, title: "HARRISONWORLD ブース", booth: "3F-B14", floor: "3F", exhibitor: "HARRISONWORLD CO.,LTD.", genre: "その他", description: "HARRISONWORLDの出展ブース。" },
  { id: 300, title: "京都コンピュータ学院 ブース", booth: "3F-B15", floor: "3F", exhibitor: "京都コンピュータ学院", genre: "その他", description: "京都コンピュータ学院の出展ブース。" },
  { id: 301, title: "Indie Game Lab Japon", booth: "3F-B16", floor: "3F", exhibitor: "Indie Game Lab Japon", genre: "その他", description: "Indie Game Lab Japonの出展ブース。" },
  { id: 302, title: "グラビティゲームアライズ ブース", booth: "3F-B17", floor: "3F", exhibitor: "グラビティゲームアライズ", genre: "その他", description: "グラビティゲームアライズの出展ブース。" },
  { id: 303, title: "BeXide ブース", booth: "3F-B18", floor: "3F", exhibitor: "BeXide", genre: "その他", description: "BeXideの出展ブース。" },
  { id: 304, title: "面白法人カヤック ブース", booth: "3F-B19", floor: "3F", exhibitor: "面白法人カヤック", genre: "その他", description: "カヤックの出展ブース。" },
  { id: 305, title: "KADOKAWA Game Linkage", booth: "3F-B20", floor: "3F", exhibitor: "KADOKAWA Game Linkage", genre: "その他", description: "KADOKAWA Game Linkageの出展ブース。" },
  { id: 306, title: "Phoenixx ブース", booth: "3F-B21", floor: "3F", exhibitor: "Phoenixx", genre: "その他", description: "Phoenixxの出展ブース。" },
  { id: 307, title: "Beep Japan ブース", booth: "3F-B22", floor: "3F", exhibitor: "Beep Japan", genre: "その他", description: "Beep Japanの出展ブース。" },
  { id: 308, title: "lowiro ブース", booth: "3F-B23", floor: "3F", exhibitor: "lowiro", genre: "音楽", description: "Arcaeaシリーズで知られるlowiroのブース。" },
  { id: 309, title: "オプテージ ブース", booth: "3F-B24", floor: "3F", exhibitor: "オプテージ", genre: "その他", description: "オプテージの出展ブース。" },
  { id: 310, title: "HappyPlayer ブース", booth: "3F-B25", floor: "3F", exhibitor: "HappyPlayer", genre: "その他", description: "HappyPlayerの出展ブース。" },
  { id: 311, title: "MDEC ブース", booth: "3F-B26", floor: "3F", exhibitor: "Malaysia Digital Economy Corporation (MDEC)", genre: "その他", description: "マレーシアデジタル経済公社のブース。" },
  { id: 312, title: "Double Fine Productions ブース", booth: "3F-B27", floor: "3F", exhibitor: "Double Fine Productions / Xbox Game Studios", genre: "アドベンチャー", description: "Kiln、Keeperを出展。" },
  { id: 313, title: "Soft Source ブース", booth: "3F-B28", floor: "3F", exhibitor: "Soft Source", genre: "その他", description: "Soft Sourceの出展ブース。" },
  { id: 314, title: "Gocha Gocha Games ブース", booth: "3F-B29", floor: "3F", exhibitor: "Gocha Gocha Games", genre: "その他", description: "Gocha Gocha Gamesの出展ブース。" },
  { id: 315, title: "中野亘 × 宮澤卓宏 ブース", booth: "3F-B30", floor: "3F", exhibitor: "中野亘 × 宮澤卓宏", genre: "その他", description: "中野亘 × 宮澤卓宏の出展ブース。" },
  { id: 316, title: "ニューラルソフトウェア ブース", booth: "3F-B31", floor: "3F", exhibitor: "株式会社ニューラルソフトウェア", genre: "その他", description: "ニューラルソフトウェアの出展ブース。" },
  { id: 317, title: "Odencat ブース", booth: "3F-B32", floor: "3F", exhibitor: "Odencat", genre: "アドベンチャー", description: "Odencatの出展ブース。" },
  { id: 318, title: "灯白社 ブース", booth: "3F-B33", floor: "3F", exhibitor: "株式会社 灯白社", genre: "アドベンチャー", description: "灯白社の出展ブース。" },
  { id: 319, title: "ワンダーランドカザキリ ブース", booth: "3F-B34", floor: "3F", exhibitor: "ワンダーランドカザキリ", genre: "その他", description: "ワンダーランドカザキリの出展ブース。" },
  { id: 320, title: "KIC Games ブース", booth: "3F-B35", floor: "3F", exhibitor: "KIC Games", genre: "その他", description: "KIC Gamesの出展ブース。" },
  { id: 321, title: "ザクザクゲーム ブース", booth: "3F-B36", floor: "3F", exhibitor: "ザクザクゲーム", genre: "その他", description: "ザクザクゲームの出展ブース。" },
  { id: 322, title: "THIRD ブース", booth: "3F-B37", floor: "3F", exhibitor: "THIRD", genre: "その他", description: "THIRDの出展ブース。" },
  { id: 323, title: "アコードセブン ブース", booth: "3F-B38", floor: "3F", exhibitor: "株式会社アコードセブン", genre: "その他", description: "アコードセブンの出展ブース。" },
  { id: 324, title: "Nestopi ブース", booth: "3F-B39", floor: "3F", exhibitor: "株式会社Nestopi", genre: "その他", description: "Nestopiの出展ブース。" },
  { id: 325, title: "Audiokinetic ブース", booth: "3F-B40", floor: "3F", exhibitor: "Audiokinetic株式会社", genre: "その他", description: "Wwiseで知られるAudiokineticのブース。" },
  { id: 326, title: "総合地球環境学研究所 Sustai-N-ableプロジェクト", booth: "3F-B41", floor: "3F", exhibitor: "総合地球環境学研究所 Sustai-N-ableプロジェクト", genre: "その他", description: "Sustai-N-ableプロジェクトの出展ブース。" },
  { id: 327, title: "クアドラアニマ ブース", booth: "3F-B42", floor: "3F", exhibitor: "株式会社クアドラアニマ", genre: "その他", description: "クアドラアニマの出展ブース。" },
  { id: 328, title: "lablab ブース", booth: "3F-B43", floor: "3F", exhibitor: "lablab", genre: "その他", description: "lablabの出展ブース。" },
  { id: 329, title: "BitSummit Game Jam", booth: "3F-BSGJ", floor: "3F", exhibitor: "BitSummit", genre: "その他", description: "会場でその場で開催されるゲームジャム企画。" },
  { id: 330, title: "ゲームクリエイター甲子園", booth: "3F-GCG", floor: "3F", exhibitor: "ゲームクリエイター甲子園", genre: "その他", description: "若手ゲームクリエイターの作品展示エリア。" },
  { id: 331, title: "『無双∞』公式物販ブース", booth: "1F-E11", floor: "1F", exhibitor: "株式会社クラウドイリュージョン", genre: "その他", description: "『無双∞』に関連する公式グッズを販売する物販ブース。" },
];

// ===== CSVスプレッドシートから生成したマップデータ =====
// 1Fマップ (67行 x 113列)
const MAP_1F = [
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "1F-E05", "1F-E05", "", "1F-E06", "1F-E06", "1F-E06", "1F-E06", "", "pillar", "pillar", "", "1F-E07", "1F-E07", "1F-E07", "1F-E07", "", "1F-E08", "1F-E08", "1F-E08", "1F-E08", "", "", "1F-E09", "1F-E09", "1F-E09", "1F-E09", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10"],
  ["", "", "", "", "", "", "", "1F-B16", "1F-B16", "1F-B16", "", "1F-B17", "1F-B17", "1F-B17", "", "1F-B18", "1F-B18", "1F-B18", "", "1F-B19", "1F-B19", "1F-B19", "", "1F-B20", "1F-B20", "1F-B20", "", "1F-B21", "1F-B21", "1F-B21", "", "pillar", "pillar", "", "1F-B22", "1F-B22", "1F-B22", "", "1F-B23", "1F-B23", "1F-B23", "", "1F-B24", "1F-B24", "1F-B24", "", "1F-B25", "1F-B25", "1F-B25", "", "1F-B26", "1F-B26", "1F-B26", "", "1F-B27", "1F-B27", "1F-B27", "", "1F-B28", "1F-B28", "1F-B28", "", "1F-B29", "1F-B29", "1F-B29", "", "", "pillar", "pillar", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "1F-U01", "1F-U01", "1F-U01", "1F-U01", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B07", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B07", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B07", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "1F-U02", "1F-U02", "1F-U02", "1F-U02", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "BF", "BF", "", "BF", "BF", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B08", "", "", "", "", "1F-D01", "", "1F-D05", "", "", "", "", "", "1F-D09", "", "1F-D13", "", "", "", "", "", "1F-D17", "", "1F-D21", "", "", "", "", "", "", "", "", "", "", "", "", "1F-D25", "", "1F-D29", "", "", "", "", "", "1F-D33", "", "1F-D37", "", "", "", "", "", "1F-D41", "", "1F-D45", "", "", "", "", "", "", "", "1F-D49", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "BF", "BF", "", "BF", "BF", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B08", "", "", "", "", "1F-D01", "", "1F-D05", "", "", "", "", "", "1F-D09", "", "1F-D13", "", "", "", "", "", "1F-D17", "", "1F-D21", "", "", "", "", "", "", "", "", "", "", "", "", "1F-D25", "", "1F-D29", "", "", "", "", "", "1F-D33", "", "1F-D37", "", "", "", "", "", "1F-D41", "", "1F-D45", "", "", "", "", "", "", "", "1F-D49", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B08", "", "", "", "", "1F-D01", "", "1F-D05", "", "", "", "", "", "1F-D09", "", "1F-D13", "", "", "", "", "", "1F-D17", "", "1F-D21", "", "", "", "", "", "", "", "", "", "", "", "", "1F-D25", "", "1F-D29", "", "", "", "", "", "1F-D33", "", "1F-D37", "", "", "", "", "", "1F-D41", "", "1F-D45", "", "", "", "", "", "", "", "1F-D49", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-U03", "1F-U03", "1F-U03", "1F-U03", "", "", "", "", "", "", "", "", "", "", "", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B09", "", "", "", "", "1F-D02", "", "1F-D06", "", "", "", "", "", "1F-D10", "", "1F-D14", "", "", "", "", "", "1F-D18", "", "1F-D22", "", "", "", "", "", "", "", "", "", "", "", "", "1F-D26", "", "1F-D30", "", "", "", "", "", "1F-D34", "", "1F-D38", "", "", "", "", "", "1F-D42", "", "1F-D46", "", "", "", "", "", "", "", "1F-D50", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "BF", "BF", "", "BF", "BF", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B09", "", "", "", "", "1F-D02", "", "1F-D06", "", "", "", "", "", "1F-D10", "", "1F-D14", "", "", "", "", "", "1F-D18", "", "1F-D22", "", "", "", "", "", "", "", "", "", "", "", "", "1F-D26", "", "1F-D30", "", "", "", "", "", "1F-D34", "", "1F-D38", "", "", "", "", "", "1F-D42", "", "1F-D46", "", "", "", "", "", "", "", "1F-D50", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "BF", "BF", "", "BF", "BF", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B09", "", "", "", "", "1F-D02", "", "1F-D06", "", "", "", "", "", "1F-D10", "", "1F-D14", "", "", "", "", "", "1F-D18", "", "1F-D22", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "1F-D26", "", "1F-D30", "", "", "", "", "", "1F-D34", "", "1F-D38", "", "", "", "", "", "1F-D42", "", "1F-D46", "", "", "", "", "", "", "", "1F-D50", "", "", "pillar", "pillar", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "1F-U04", "1F-U04", "1F-U04", "1F-U04", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B10", "", "", "", "", "1F-D03", "", "1F-D07", "", "", "", "", "", "1F-D11", "", "1F-D15", "", "", "", "", "", "1F-D19", "", "1F-D23", "", "", "", "", "", "", "", "", "", "", "", "", "1F-D27", "", "1F-D31", "", "", "", "", "", "1F-D35", "", "1F-D39", "", "", "", "", "", "1F-D43", "", "1F-D47", "", "", "", "", "", "", "", "1F-D51", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B10", "", "", "", "", "1F-D03", "", "1F-D07", "", "", "", "", "", "1F-D11", "", "1F-D15", "", "", "", "", "", "1F-D19", "", "1F-D23", "", "", "", "", "", "1F-D53", "1F-D53", "", "", "", "", "", "1F-D27", "", "1F-D31", "", "", "", "", "", "1F-D35", "", "1F-D39", "", "", "", "", "", "1F-D43", "", "1F-D47", "", "", "", "", "", "", "", "1F-D51", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "1F-U07", "", "", "", "BF", "BF", "", "BF", "BF", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "", "", ""],
  ["", "", "1F-B10", "", "", "", "", "1F-D03", "", "1F-D07", "", "", "", "", "", "1F-D11", "", "1F-D15", "", "", "", "", "", "1F-D19", "", "1F-D23", "", "", "", "", "", "", "", "", "", "", "", "", "1F-D27", "", "1F-D31", "", "", "", "", "", "1F-D35", "", "1F-D39", "", "", "", "", "", "1F-D43", "", "1F-D47", "", "", "", "", "", "", "", "1F-D51", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-U05", "1F-U05", "1F-U05", "1F-U05", "", "", "1F-U07", "", "", "", "BF", "BF", "", "BF", "BF", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-U07", "", "", "", "", "", "", "", "", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B11", "", "", "", "", "1F-D04", "", "1F-D08", "", "", "", "", "", "1F-D12", "", "1F-D16", "", "", "", "", "", "1F-D20", "", "1F-D24", "", "", "", "", "", "", "", "", "", "", "", "", "1F-D28", "", "1F-D32", "", "", "", "", "", "1F-D36", "", "1F-D40", "", "", "", "", "", "1F-D44", "", "1F-D48", "", "", "", "", "", "", "", "1F-D52", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-U07", "", "", "", "", "", "", "", "", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B11", "", "", "", "", "1F-D04", "", "1F-D08", "", "", "", "", "", "1F-D12", "", "1F-D16", "", "", "", "", "", "1F-D20", "", "1F-D24", "", "", "", "", "", "", "", "", "", "", "", "", "1F-D28", "", "1F-D32", "", "", "", "", "", "1F-D36", "", "1F-D40", "", "", "", "", "", "1F-D44", "", "1F-D48", "", "", "", "", "", "", "", "1F-D52", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-U07", "", "", "", "", "", "", "", "", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B11", "", "", "", "", "1F-D04", "", "1F-D08", "", "", "", "", "", "1F-D12", "", "1F-D16", "", "", "", "", "", "1F-D20", "", "1F-D24", "", "", "", "", "", "1F-D54", "1F-D54", "", "", "", "", "", "1F-D28", "", "1F-D32", "", "", "", "", "", "1F-D36", "", "1F-D40", "", "", "", "", "", "1F-D44", "", "1F-D48", "", "", "", "", "", "", "", "1F-D52", "", "", "", "", "", "", "", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "", "1F-U06", "1F-U06", "1F-U06", "1F-U06", "", "", "1F-U07", "", "", "", "BF", "BF", "", "BF", "BF", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "", "", "", "", "", "", "", "1F-U07", "", "", "", "BF", "BF", "", "BF", "BF", "", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "1F-E10", "", "", "1F-E10", "", ""],
  ["", "", "1F-B12", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B12", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "1F-A18", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B12", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-B06", "", ""],
  ["", "", "1F-B12", "", "", "", "", "", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "", "", "", "", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-B06", "", ""],
  ["", "", "1F-B12", "", "", "", "", "", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "", "", "", "", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "", "", "", "", "", "1F-D55", "1F-D55", "", "", "", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "", "", "", "", "", "", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-B06", "", ""],
  ["", "", "1F-B12", "", "", "", "", "", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "", "", "", "", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "", "", "", "", "", "", "", "", "", "", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "", "", "", "", "", "", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-B06", "", ""],
  ["", "", "", "", "", "", "", "", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "", "", "", "", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "", "", "", "", "", "", "", "", "", "", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "", "", "", "", "", "", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-B06", "", ""],
  ["", "", "1F-B13", "", "", "", "", "", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "", "", "", "", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "1F-A24", "", "", "", "", "", "", "", "", "", "", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "", "", "", "", "", "", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B13", "", "", "", "", "", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "1F-A23", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "1F-A25", "", "", "", "", "", "", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A26", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "1F-A27", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "", "", "", "", "", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B13", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "1F-A17", "", "", "pillar", "pillar", "", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "", "", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "", "", ""],
  ["", "", "1F-B13", "", "", "", "", "", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "", "", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "", "", ""],
  ["", "", "1F-B13", "", "", "", "", "", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "", "", "", "", "", "", "", "", "", "", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A19", "1F-A19", "1F-A19", "1F-A19", "", "", "1F-B05", "1F-B05", "1F-B05", "1F-B05", "", "", "1F-A22", "1F-A22", "1F-A22", "1F-A22", "", "", "", "", "", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "1F-A12", "", "", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "", "", ""],
  ["", "", "1F-B13", "", "", "", "", "", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "", "", "", "", "", "1F-C04", "1F-C04", "", "", "", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "", "", "", "", "", "", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "", "", "", "", "", "", "", "", "1F-A19", "1F-A19", "1F-A19", "1F-A19", "", "", "1F-B05", "1F-B05", "1F-B05", "1F-B05", "", "", "1F-A22", "1F-A22", "1F-A22", "1F-A22", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "", "", ""],
  ["", "", "", "", "", "", "", "", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "", "", "", "", "", "", "", "", "", "", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "", "", "", "", "", "", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "", "", "", "", "", "", "", "", "1F-A19", "1F-A19", "1F-A19", "1F-A19", "", "", "1F-B05", "1F-B05", "1F-B05", "1F-B05", "", "", "1F-A22", "1F-A22", "1F-A22", "1F-A22", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "", "", ""],
  ["", "", "1F-B14", "", "", "", "", "", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "1F-A14", "", "", "", "", "", "", "", "", "", "", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "", "", "", "", "", "", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "", "", "", "", "", "", "", "", "1F-A19", "1F-A19", "1F-A19", "1F-A19", "", "", "1F-B05", "1F-B05", "1F-B05", "1F-B05", "", "", "1F-A22", "1F-A22", "1F-A22", "1F-A22", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "1F-A21", "", "", ""],
  ["", "", "1F-B14", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "1F-A15", "", "", "", "", "", "", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B14", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "1F-A16", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B14", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "", "", "1F-A11", "1F-A11", "1F-A11", "1F-A11", "1F-A11", "", "", "pillar", "pillar", "", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "", "", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "", "", ""],
  ["", "", "1F-B14", "", "", "", "", "", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "", "", "", "", "", "pillar", "pillar", "", "", "", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "", "", "1F-A11", "1F-A11", "1F-A11", "1F-A11", "1F-A11", "", "", "pillar", "pillar", "", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "", "", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "", "", ""],
  ["", "", "1F-B14", "", "", "", "", "", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "", "", "", "", "", "", "", "", "", "", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "", "", "1F-A11", "1F-A11", "1F-A11", "1F-A11", "1F-A11", "", "", "", "", "", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "1F-A20", "", "", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "", "", ""],
  ["", "", "", "", "", "", "", "", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "", "", "", "", "", "1F-B30", "1F-B30", "", "", "", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "", "", "1F-A11", "1F-A11", "1F-A11", "1F-A11", "1F-A11", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "", "", "", "", "", "", "", "", "", "", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "", "", "", "", "", "", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "", "", "", "", "", "", "", "", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "1F-A10", "", "", "1F-A11", "1F-A11", "1F-A11", "1F-A11", "1F-A11", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "1F-A08", "", "", "", "", "", "", "", "", "", "", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "1F-A09", "", "", "", "", "", "", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "1F-A13", "", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "", "", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "", "", "", "", "", "pillar", "pillar", "", "", "", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "", "", "", "", "", "", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "", "", "", "pillar", "pillar", "", "", "", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "", "", "1F-A05", "1F-A05", "1F-A05", "1F-A05", "1F-A05", "", "", "pillar", "pillar", "", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "", "", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "", "", ""],
  ["", "", "", "", "", "", "", "", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "", "", "", "", "", "pillar", "pillar", "", "", "", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "", "", "", "", "", "", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "", "", "", "pillar", "pillar", "", "", "", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "", "", "1F-A05", "1F-A05", "1F-A05", "1F-A05", "1F-A05", "", "", "pillar", "pillar", "", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "", "", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "", "", "", "", "", "", "", "", "", "", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "", "", "", "", "", "", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "", "", "", "", "", "", "", "", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "", "", "1F-A05", "1F-A05", "1F-A05", "1F-A05", "1F-A05", "", "", "", "", "", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "", "", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "", "", "", "", "", "", "", "", "", "", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "", "", "", "", "", "", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "", "", "", "", "", "", "", "", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "", "", "1F-A05", "1F-A05", "1F-A05", "1F-A05", "1F-A05", "", "", "", "", "", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "", "", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "1F-A01", "", "", "", "", "", "", "", "", "", "", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "1F-A02", "", "", "", "", "", "", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "1F-A03", "", "", "", "", "", "", "", "", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "1F-A04", "", "", "1F-A05", "1F-A05", "1F-A05", "1F-A05", "1F-A05", "", "", "", "", "", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "1F-A06", "", "", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "1F-A07", "", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-E11", "", ""],
  ["", "", "1F-B15", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-E11", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-E11", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-E11", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "pillar", "pillar", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-E11", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "1F-B01", "1F-B01", "1F-B01", "1F-B01", "", "1F-B02", "1F-B02", "1F-B02", "1F-B02", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1F-C01", "1F-C01", "", "", "", "", "1F-B03", "1F-B03", "1F-B03", "1F-B03", "", "1F-B04", "1F-B04", "1F-B04", "1F-B04", "1F-B04", "1F-B04", "", "1F-B04", "1F-B04", "1F-B04", "1F-B04", "1F-B04", "1F-B04", "", "", "", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "", "", "", "", "1F-E01", "", "1F-E01", "1F-E01", "1F-E01", "1F-E01", "", "1F-E02", "1F-E02", "1F-E02", "1F-E02", "", "1F-E03", "1F-E03", "1F-E03", "1F-E03", "", "1F-C02", "1F-C02", "1F-C02", "", "", "1F-C03", "1F-C03", "1F-C03", "", "", "", "", "", "", "1F-E04", "1F-E04", "1F-E04", "1F-E04", "1F-E04", "1F-E04", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Exit", "Exit", "Exit", "Exit", "Exit", "", "", "", "", "", "", "", "", "", "", "", ""]
];

// 3Fマップ (67行 x 113列)
const MAP_3F = [
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "3F-E03", "3F-E03", "3F-E03", "", "3F-B29", "3F-B29", "3F-B29", "", "3F-B30", "3F-B30", "3F-B30", "", "3F-B31", "3F-B31", "3F-B31", "", "3F-B32", "3F-B32", "3F-B32", "", "3F-C14", "3F-C14", "3F-C14", "", "3F-C15", "3F-C15", "3F-C15", "", "3F-C16", "3F-C16", "3F-C16", "", "3F-C17", "3F-C17", "3F-C17", "", "3F-C18", "3F-C18", "3F-C18", "", "3F-C19", "3F-C19", "3F-C19", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B33", "3F-B33", "", "3F-B34", "3F-B34", "", "3F-B35", "3F-B35", "", "3F-B36", "3F-B36", "", "3F-B37", "3F-B37", "", "3F-B38", "3F-B38", "", "3F-B39", "3F-B39", "", "3F-B40", "3F-B40", "", "3F-B41", "3F-B41", "", "3F-B42", "3F-B42", "", "3F-B43", "3F-B43", "", "3F-E04", "3F-E04", "3F-E04", "3F-E04"],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "3F-E02", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D01", "", "3F-D04", "", "", "3F-D07", "", "3F-D14", "", "", "3F-D21", "", "3F-D28", "", "", "3F-D35", "", "3F-D41", "", "", "3F-D47", "", "3F-D53", "", "", "3F-D59", "", "3F-D65", "", "", "", "", "", "", "", "3F-B44", "", ""],
  ["", "", "3F-E02", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "3F-D01", "", "3F-D04", "", "", "3F-D07", "", "3F-D14", "", "", "3F-D21", "", "3F-D28", "", "", "3F-D35", "", "3F-D41", "", "", "3F-D47", "", "3F-D53", "", "", "3F-D59", "", "3F-D65", "", "", "", "", "", "", "", "3F-B44", "", ""],
  ["", "", "3F-E02", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D01", "", "3F-D04", "", "", "3F-D07", "", "3F-D14", "", "", "3F-D21", "", "3F-D28", "", "", "3F-D35", "", "3F-D41", "", "", "3F-D47", "", "3F-D53", "", "", "3F-D59", "", "3F-D65", "", "", "", "", "", "", "", "3F-B44", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "3F-B10", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D02", "", "3F-D05", "", "", "3F-D08", "", "3F-D15", "", "", "3F-D22", "", "3F-D29", "", "", "3F-D36", "", "3F-D42", "", "", "3F-D48", "", "3F-D54", "", "", "3F-D60", "", "3F-D66", "", "", "", "", "", "", "", "3F-B45", "", ""],
  ["", "", "3F-B10", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-U04", "3F-U04", "", "", "", "", "", "3F-U05", "", "3F-U06", "", "", "", "", "", "", "3F-U07", "", "3F-U08", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "3F-D02", "", "3F-D05", "", "", "3F-D08", "", "3F-D15", "", "", "3F-D22", "", "3F-D29", "", "", "3F-D36", "", "3F-D42", "", "", "3F-D48", "", "3F-D54", "", "", "3F-D60", "", "3F-D66", "", "", "", "", "", "", "", "3F-B45", "", ""],
  ["", "", "3F-B10", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-U03", "3F-U03", "3F-U03", "", "", "3F-U04", "3F-U04", "", "", "", "", "", "3F-U05", "", "3F-U06", "", "", "", "", "", "", "3F-U07", "", "3F-U08", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D02", "", "3F-D05", "", "", "3F-D08", "", "3F-D15", "", "", "3F-D22", "", "3F-D29", "", "", "3F-D36", "", "3F-D42", "", "", "3F-D48", "", "3F-D54", "", "", "3F-D60", "", "3F-D66", "", "", "", "", "", "", "", "3F-B45", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-U04", "3F-U04", "", "", "", "", "", "3F-U05", "", "3F-U06", "", "", "", "", "", "", "3F-U07", "", "3F-U08", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "3F-B11", "", "", "", "", "", "3F-U01", "3F-U01", "3F-U01", "", "3F-U02", "3F-U02", "3F-U02", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-U29", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D03", "", "3F-D06", "", "", "3F-D09", "", "3F-D16", "", "", "3F-D23", "", "3F-D30", "", "", "3F-D37", "", "3F-D43", "", "", "3F-D49", "", "3F-D55", "", "", "3F-D61", "", "3F-D67", "", "", "", "", "", "", "", "3F-B19", "", ""],
  ["", "", "3F-B11", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-U29", "", "", "3F-U32", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "3F-D03", "", "3F-D06", "", "", "3F-D09", "", "3F-D16", "", "", "3F-D23", "", "3F-D30", "", "", "3F-D37", "", "3F-D43", "", "", "3F-D49", "", "3F-D55", "", "", "3F-D61", "", "3F-D67", "", "", "", "", "", "", "", "3F-B19", "", ""],
  ["", "", "3F-B11", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-U29", "", "", "3F-U32", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D03", "", "3F-D06", "", "", "3F-D09", "", "3F-D16", "", "", "3F-D23", "", "3F-D30", "", "", "3F-D37", "", "3F-D43", "", "", "3F-D49", "", "3F-D55", "", "", "3F-D61", "", "3F-D67", "", "", "", "", "", "", "", "3F-B19", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "3F-U09", "", "3F-U11", "", "", "", "", "", "", "3F-U14", "", "3F-U16", "", "", "", "", "", "", "3F-U19", "", "3F-U21", "", "", "", "", "", "", "3F-U24", "", "3F-U26", "", "", "", "", "", "", "", "", "3F-U32", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "3F-B12", "", "", "", "", "", "", "", "3F-U09", "", "3F-U11", "", "", "", "", "", "", "3F-U14", "", "3F-U16", "", "", "", "", "", "", "3F-U19", "", "3F-U21", "", "", "", "", "", "", "3F-U24", "", "3F-U26", "", "", "", "", "", "3F-U30", "", "", "", "", "", "", "", "", "", "", "", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "stage", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B20", "", ""],
  ["", "", "3F-B12", "", "", "", "", "", "", "", "3F-U09", "", "3F-U11", "", "", "", "", "", "", "3F-U14", "", "3F-U16", "", "", "", "", "", "", "3F-U19", "", "3F-U21", "", "", "", "", "", "", "3F-U24", "", "3F-U26", "", "", "", "", "", "3F-U30", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D10", "", "3F-D17", "", "", "3F-D24", "", "3F-D31", "", "", "3F-D38", "", "3F-D44", "", "", "3F-D50", "", "3F-D56", "", "", "3F-D62", "", "3F-D68", "", "", "", "", "", "", "", "3F-B20", "", ""],
  ["", "", "3F-B12", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-U30", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D10", "", "3F-D17", "", "", "3F-D24", "", "3F-D31", "", "", "3F-D38", "", "3F-D44", "", "", "3F-D50", "", "3F-D56", "", "", "3F-D62", "", "3F-D68", "", "", "", "", "", "", "", "3F-B20", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "3F-U10", "", "3F-U12", "", "", "", "", "", "", "3F-U15", "", "3F-U17", "", "", "", "", "", "", "3F-U20", "", "3F-U22", "", "", "", "", "", "", "3F-U25", "", "3F-U27", "", "", "", "", "", "", "", "", "3F-U33", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D10", "", "3F-D17", "", "", "3F-D24", "", "3F-D31", "", "", "3F-D38", "", "3F-D44", "", "", "3F-D50", "", "3F-D56", "", "", "3F-D62", "", "3F-D68", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "3F-B13", "", "", "", "", "", "", "", "3F-U10", "", "3F-U12", "", "", "", "", "", "", "3F-U15", "", "3F-U17", "", "", "", "", "", "", "3F-U20", "", "3F-U22", "", "", "", "", "", "", "3F-U25", "", "3F-U27", "", "", "", "", "", "3F-U31", "", "", "3F-U33", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B21", "", ""],
  ["", "", "3F-B13", "", "", "", "", "", "", "", "3F-U10", "", "3F-U12", "", "", "", "", "", "", "3F-U15", "", "3F-U17", "", "", "", "", "", "", "3F-U20", "", "3F-U22", "", "", "", "", "", "", "3F-U25", "", "3F-U27", "", "", "", "", "", "3F-U31", "", "", "3F-U33", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D11", "", "3F-D18", "", "", "3F-D25", "", "3F-D32", "", "", "3F-D39", "", "3F-D45", "", "", "3F-D51", "", "3F-D57", "", "", "3F-D63", "", "3F-D69", "", "", "", "", "", "", "", "3F-B21", "", ""],
  ["", "", "3F-B13", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-U31", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D11", "", "3F-D18", "", "", "3F-D25", "", "3F-D32", "", "", "3F-D39", "", "3F-D45", "", "", "3F-D51", "", "3F-D57", "", "", "3F-D63", "", "3F-D69", "", "", "", "", "", "", "", "3F-B21", "", ""],
  ["", "", "3F-B13", "", "", "", "", "", "", "", "3F-U13", "3F-U13", "3F-U13", "", "", "", "", "", "", "3F-U18", "3F-U18", "3F-U18", "", "", "", "", "", "", "3F-U23", "3F-U23", "3F-U23", "", "", "", "", "", "", "3F-U28", "3F-U28", "3F-U28", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D11", "", "3F-D18", "", "", "3F-D25", "", "3F-D32", "", "", "3F-D39", "", "3F-D45", "", "", "3F-D51", "", "3F-D57", "", "", "3F-D63", "", "3F-D69", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B22", "", ""],
  ["", "", "3F-B14", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D12", "", "3F-D19", "", "", "3F-D26", "", "3F-D33", "", "", "3F-D40", "", "3F-D46", "", "", "3F-D52", "", "3F-D58", "", "", "3F-D64", "", "3F-D70", "", "", "", "", "", "", "", "3F-B22", "", ""],
  ["", "", "3F-B14", "", "", "", "", "", "", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "", "", "", "", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "", "", "", "", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "3F-GCG", "", "", "3F-C13", "3F-C13", "3F-C13", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D12", "", "3F-D19", "", "", "3F-D26", "", "3F-D33", "", "", "3F-D40", "", "3F-D46", "", "", "3F-D52", "", "3F-D58", "", "", "3F-D64", "", "3F-D70", "", "", "", "", "", "", "", "3F-B22", "", ""],
  ["", "", "3F-B14", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-D12", "", "3F-D19", "", "", "3F-D26", "", "3F-D33", "", "", "3F-D40", "", "3F-D46", "", "", "3F-D52", "", "3F-D58", "", "", "3F-D64", "", "3F-D70", "", "", "", "", "", "", "", "3F-B22", "", ""],
  ["", "", "3F-B14", "", "", "", "", "", "", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "", "", "", "", "", "", "", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-A24", "3F-A24", "3F-A24", "3F-A24", "", "", "", "", "3F-A25", "3F-A25", "3F-A25", "3F-A25", "", "", "", "", "3F-A26", "3F-A26", "3F-A26", "3F-A26", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B22", "", ""],
  ["", "", "3F-B14", "", "", "", "", "", "", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "", "", "", "", "", "", "", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "", "", "", "", "", "", "", "3F-A22", "3F-A22", "3F-A22", "3F-A22", "3F-A22", "", "", "", "", "", "", "", "", "3F-A23", "3F-A23", "3F-A23", "3F-A23", "3F-A23", "", "", "", "", "", "3F-A24", "3F-A24", "3F-A24", "3F-A24", "", "", "", "", "3F-A25", "3F-A25", "3F-A25", "3F-A25", "", "", "", "", "3F-A26", "3F-A26", "3F-A26", "3F-A26", "", "", "3F-D13", "", "3F-D20", "", "", "3F-D27", "", "3F-D34", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "3F-B14", "", "", "", "", "", "", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "", "", "", "", "", "", "", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "", "", "", "", "", "", "", "3F-A22", "3F-A22", "3F-A22", "3F-A22", "3F-A22", "", "", "", "", "", "", "", "", "3F-A23", "3F-A23", "3F-A23", "3F-A23", "3F-A23", "", "", "", "", "", "3F-A24", "3F-A24", "3F-A24", "3F-A24", "", "", "", "", "3F-A25", "3F-A25", "3F-A25", "3F-A25", "", "", "", "", "3F-A26", "3F-A26", "3F-A26", "3F-A26", "", "", "3F-D13", "", "3F-D20", "", "", "3F-D27", "", "3F-D34", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B23", "", ""],
  ["", "", "", "", "", "", "", "", "", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "", "", "", "", "", "", "", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "", "", "", "", "", "", "", "3F-A22", "3F-A22", "3F-A22", "3F-A22", "3F-A22", "", "", "", "", "", "", "", "", "3F-A23", "3F-A23", "3F-A23", "3F-A23", "3F-A23", "", "", "", "", "", "3F-A24", "3F-A24", "3F-A24", "3F-A24", "", "", "", "", "3F-A25", "3F-A25", "3F-A25", "3F-A25", "", "", "", "", "3F-A26", "3F-A26", "3F-A26", "3F-A26", "", "", "3F-D13", "", "3F-D20", "", "", "3F-D27", "", "3F-D34", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B23", "", ""],
  ["", "", "3F-B15", "", "", "", "", "", "", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "", "", "", "", "", "", "", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "", "", "", "", "", "", "", "3F-A22", "3F-A22", "3F-A22", "3F-A22", "3F-A22", "", "", "", "", "", "", "", "", "3F-A23", "3F-A23", "3F-A23", "3F-A23", "3F-A23", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B23", "", ""],
  ["", "", "3F-B15", "", "", "", "", "", "", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "3F-A20", "", "", "", "", "", "", "", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "3F-A21", "", "", "", "", "", "", "", "3F-A22", "3F-A22", "3F-A22", "3F-A22", "3F-A22", "", "", "", "", "", "", "", "", "3F-A23", "3F-A23", "3F-A23", "3F-A23", "3F-A23", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B23", "", ""],
  ["", "", "3F-B15", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-C05", "3F-C05", "3F-C05", "3F-C05", "3F-C05", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B23", "", ""],
  ["", "", "3F-B15", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "3F-B15", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-A17", "3F-A17", "3F-A17", "3F-A17", "", "", "", "", "3F-A18", "3F-A18", "3F-A18", "3F-A18", "", "", "", "", "3F-A19", "3F-A19", "3F-A19", "3F-A19", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-C08", "", "3F-C09", "", "", "", "3F-C10", "", "3F-C11", "", "", "", "3F-B24", "", ""],
  ["", "", "3F-B15", "", "", "", "", "", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "", "3F-C12", "", "", "", "", "", "", "", "", "", "3F-A17", "3F-A17", "3F-A17", "3F-A17", "", "", "", "", "3F-A18", "3F-A18", "3F-A18", "3F-A18", "", "", "", "", "3F-A19", "3F-A19", "3F-A19", "3F-A19", "", "", "", "", "", "", "", "3F-C03", "", "", "3F-C04", "", "", "3F-C06", "", "", "3F-C07", "", "", "", "3F-C08", "", "3F-C09", "", "", "", "3F-C10", "", "3F-C11", "", "", "", "3F-B24", "", ""],
  ["", "", "", "", "", "", "", "", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "3F-BSGJ", "3F-BSGJ", "", "", "3F-C12", "", "", "", "", "", "", "", "", "", "3F-A17", "3F-A17", "3F-A17", "3F-A17", "", "", "", "", "3F-A18", "3F-A18", "3F-A18", "3F-A18", "", "", "", "", "3F-A19", "3F-A19", "3F-A19", "3F-A19", "", "", "", "", "", "", "", "3F-C03", "", "", "3F-C04", "", "", "3F-C06", "", "", "3F-C07", "", "", "", "3F-C08", "", "3F-C09", "", "", "", "3F-C10", "", "3F-C11", "", "", "", "3F-B24", "", ""],
  ["", "", "3F-B16", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-C12", "", "", "", "", "", "", "", "", "", "3F-A17", "3F-A17", "3F-A17", "3F-A17", "", "", "", "", "3F-A18", "3F-A18", "3F-A18", "3F-A18", "", "", "", "", "3F-A19", "3F-A19", "3F-A19", "3F-A19", "", "", "", "", "", "", "", "3F-C03", "", "", "3F-C04", "", "", "3F-C06", "", "", "3F-C07", "", "", "", "3F-C08", "", "3F-C09", "", "", "", "3F-C10", "", "3F-C11", "", "", "", "3F-B24", "", ""],
  ["", "", "3F-B16", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-C12", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-C03", "", "", "3F-C04", "", "", "3F-C06", "", "", "3F-C07", "", "", "", "3F-C08", "", "3F-C09", "", "", "", "3F-C10", "", "3F-C11", "", "", "", "3F-B24", "", ""],
  ["", "", "3F-B16", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-C08", "", "3F-C09", "", "", "", "3F-C10", "", "3F-C11", "", "", "", "", "", ""],
  ["", "", "3F-B16", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B25", "", ""],
  ["", "", "3F-B16", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "", "", "", "", "", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "", "", "", "", "", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "", "", "", "", "", "", "", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "", "", "", "", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "", "", "", "", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "", "", "", "", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B25", "", ""],
  ["", "", "3F-B16", "", "", "", "", "", "", "", "3F-A07", "3F-A07", "3F-A07", "3F-A07", "3F-A07", "", "", "", "", "", "", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "", "", "", "", "", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "", "", "", "", "", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "", "", "", "", "", "", "", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "", "", "", "", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "", "", "", "", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "", "", "", "", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B25", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "3F-A07", "3F-A07", "3F-A07", "3F-A07", "3F-A07", "", "", "", "", "", "", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "", "", "", "", "", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "", "", "", "", "", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "", "", "", "", "", "", "", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "", "", "", "", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "", "", "", "", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "", "", "", "", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "", "", "", "", "", "3F-A15", "3F-A15", "3F-A15", "3F-A15", "", "", "3F-A16", "3F-A16", "3F-A16", "3F-A16", "", "", "", "3F-B25", "", ""],
  ["", "", "3F-B17", "", "", "", "", "", "", "", "3F-A07", "3F-A07", "3F-A07", "3F-A07", "3F-A07", "", "", "", "", "", "", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "", "", "", "", "", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "", "", "", "", "", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "", "", "", "", "", "", "", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "", "", "", "", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "", "", "", "", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "", "", "", "", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "", "", "", "", "", "3F-A15", "3F-A15", "3F-A15", "3F-A15", "", "", "3F-A16", "3F-A16", "3F-A16", "3F-A16", "", "", "", "3F-B25", "", ""],
  ["", "", "3F-B17", "", "", "", "", "", "", "", "3F-A07", "3F-A07", "3F-A07", "3F-A07", "3F-A07", "", "", "", "", "", "", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "", "", "", "", "", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "", "", "", "", "", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "", "", "", "", "", "", "", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "", "", "", "", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "", "", "", "", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "", "", "", "", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "", "", "", "", "", "3F-A15", "3F-A15", "3F-A15", "3F-A15", "", "", "3F-A16", "3F-A16", "3F-A16", "3F-A16", "", "", "", "", "", ""],
  ["", "", "3F-B17", "", "", "", "", "", "", "", "3F-A07", "3F-A07", "3F-A07", "3F-A07", "3F-A07", "", "", "", "", "", "", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "3F-A08", "", "", "", "", "", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "3F-A09", "", "", "", "", "", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "3F-A10", "", "", "", "", "", "", "", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "3F-A11", "", "", "", "", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "3F-A12", "", "", "", "", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "3F-A13", "", "", "", "", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "3F-A14", "", "", "", "", "", "3F-A15", "3F-A15", "3F-A15", "3F-A15", "", "", "3F-A16", "3F-A16", "3F-A16", "3F-A16", "", "", "", "3F-B27", "", ""],
  ["", "", "3F-B17", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B27", "", ""],
  ["", "", "3F-B17", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B27", "", ""],
  ["", "", "3F-B17", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "", "", "", "", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "", "", "", "", "", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B27", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "", "", "", "", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "", "", "", "", "", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B27", "", ""],
  ["", "", "3F-B18", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "", "", "", "", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "", "", "", "", "", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "", "", "", "", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "", "", "", "", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "", "", "", "", "3F-B27", "", ""],
  ["", "", "3F-B18", "", "", "", "", "", "", "", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "", "", "", "", "", "", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "", "", "", "", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "", "", "", "", "", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "", "", "", "", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "", "", "", "", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "", "", "", "", "", "", ""],
  ["", "", "3F-B18", "", "", "", "", "", "", "", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "", "", "", "", "", "", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "", "", "", "", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "", "", "", "", "", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "", "", "", "", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "", "", "", "", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "", "", "", "", "3F-B28", "", ""],
  ["", "", "3F-B18", "", "", "", "", "", "", "", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "", "", "", "", "", "", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "", "", "", "", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "", "", "", "", "", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "", "", "", "", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "", "", "", "", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "", "", "", "", "3F-B28", "", ""],
  ["", "", "3F-B18", "", "", "", "", "", "", "", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "3F-A01", "", "", "", "", "", "", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "3F-A02", "", "", "", "", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "3F-A03", "", "", "", "", "", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "3F-A04", "", "", "", "", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "3F-A05", "", "", "", "", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "3F-A06", "", "", "", "", "3F-B28", "", ""],
  ["", "", "3F-B18", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B28", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B28", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B28", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "3F-B01", "3F-B01", "3F-B01", "", "3F-B02", "3F-B02", "3F-B02", "3F-B02", "3F-B02", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "3F-B03", "3F-B03", "", "3F-B04", "3F-B04", "3F-B04", "3F-B04", "", "3F-C01", "3F-C01", "3F-C01", "3F-C01", "3F-C01", "3F-C01", "", "3F-C02", "3F-C02", "3F-C02", "3F-C02", "3F-C02", "3F-C02", "", "", "", "", "", "", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "Entrance", "", "", "", "", "3F-B05", "3F-B05", "3F-B05", "3F-B05", "3F-B05", "3F-B05", "", "3F-B06", "3F-B06", "3F-B06", "3F-B06", "3F-B06", "3F-B06", "", "3F-B07", "3F-B07", "3F-B07", "3F-B07", "3F-B07", "", "3F-B08", "3F-B08", "3F-B08", "3F-B08", "3F-B08", "", "", "", "", "", "", "3F-B09", "3F-B09", "3F-B09", "3F-B09", "3F-B09", "", "3F-E01", "3F-E01", "3F-E01", "3F-E01", "3F-E01", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "Exit", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Exit", "Exit", "Exit", "Exit", "Exit", "", "", "", "", "", "", "", "", "", "", "", ""]
];

// グリッドからブースの矩形領域をflood fillで抽出
function extractBooths(grid) {
  const visited = new Set();
  const booths = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length || 0); c++) {
      const val = grid[r][c];
      if (!val || visited.has(`${r},${c}`)) continue;
      let minR = r, maxR = r, minC = c, maxC = c;
      const queue = [[r, c]];
      visited.add(`${r},${c}`);
      while (queue.length) {
        const [cr, cc] = queue.shift();
        if (cr < minR) minR = cr; if (cr > maxR) maxR = cr;
        if (cc < minC) minC = cc; if (cc > maxC) maxC = cc;
        for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
          const nr = cr+dr, nc = cc+dc;
          if (nr>=0 && nr<grid.length && nc>=0 && nc<(grid[nr]?.length||0)
              && grid[nr][nc]===val && !visited.has(`${nr},${nc}`)) {
            visited.add(`${nr},${nc}`);
            queue.push([nr, nc]);
          }
        }
      }
      booths.push({ id: val, minR, maxR, minC, maxC });
    }
  }
  return booths;
}

// グリッドからブースの中心座標を取得
function findBoothCenter(boothId, floor) {
  const grid = floor === "1F" ? MAP_1F : MAP_3F;
  const CELL = 9, PAD = 10;
  let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length || 0); c++) {
      if (grid[r][c] === boothId) {
        minR = Math.min(minR, r); maxR = Math.max(maxR, r);
        minC = Math.min(minC, c); maxC = Math.max(maxC, c);
      }
    }
  }
  if (minR === Infinity) return null;
  return {
    cx: PAD + (minC + (maxC - minC + 1) / 2) * CELL,
    cy: PAD + (minR + (maxR - minR + 1) / 2) * CELL,
  };
}

function MapZoomContainer({ children, floor, zoomTarget }) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const gestureRef = useRef(null);
  const containerRef = useRef(null);

  const minScaleRef = useRef(0.1);

  const calcFitScale = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const inner = container.firstChild;
    if (!inner) return;
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const mapW = inner.scrollWidth;
    const mapH = inner.scrollHeight;
    if (mapW === 0 || mapH === 0) return;
    const fitScale = Math.min(containerW / mapW, containerH / mapH, 1);
    minScaleRef.current = fitScale; // 全体表示スケールを最小値として保存
    setScale(fitScale);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // パン範囲をマップの境界内に制限
  const clampTranslate = useCallback((tx, ty, currentScale) => {
    if (!containerRef.current) return { x: tx, y: ty };
    const container = containerRef.current;
    const inner = container.firstChild;
    if (!inner) return { x: tx, y: ty };
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const mapW = inner.scrollWidth;
    const mapH = inner.scrollHeight;
    const scaledW = mapW * currentScale;
    const scaledH = mapH * currentScale;
    const minX = Math.min(0, containerW - scaledW);
    const minY = Math.min(0, containerH - scaledH);
    return {
      x: Math.min(0, Math.max(minX, tx)),
      y: Math.min(0, Math.max(minY, ty)),
    };
  }, []);

  // マウント時・フロア切替時にマップ全体が収まるスケールを自動計算
  useEffect(() => {
    const timer = setTimeout(calcFitScale, 50);
    return () => clearTimeout(timer);
  }, [floor, calcFitScale]);

  // zoomTargetが変わったら該当ブースにズームイン
  useEffect(() => {
    if (!zoomTarget || !containerRef.current) return;
    const pos = findBoothCenter(zoomTarget.boothId, zoomTarget.floor);
    if (!pos) return;
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      const containerW = container.clientWidth;
      const containerH = container.clientHeight;
      const targetScale = Math.min(4, Math.max(minScaleRef.current * 2, 2.5));
      const tx = containerW / 2 - pos.cx * targetScale;
      const ty = containerH / 2 - pos.cy * targetScale;
      setScale(targetScale);
      setTranslate(clampTranslate(tx, ty, targetScale));
    }, 100);
    return () => clearTimeout(timer);
  }, [zoomTarget, clampTranslate]);

  const getDist = (t1, t2) =>
    Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

  // ===== タッチ操作（スマホ）=====
  // ネイティブのaddEventListenerを使用（SVG内でも確実に動作させるため）
  const scaleRef = useRef(scale);
  const translateRef = useRef(translate);
  scaleRef.current = scale;
  translateRef.current = translate;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const TAP_THRESHOLD = 8; // この距離以内ならタップと判定（px）

    const handleTouchStart = (e) => {
      const rect = el.getBoundingClientRect();

      if (e.touches.length === 1) {
        // 1本指：まずタップ候補として記録（preventDefaultしない）
        gestureRef.current = {
          type: "pan1",
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startTranslate: { ...translateRef.current },
          isPanning: false, // まだパン開始していない
        };
      } else if (e.touches.length === 2) {
        // 2本指：ピンチズーム
        e.preventDefault();
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
        gestureRef.current = {
          type: "pinch",
          dist: getDist(e.touches[0], e.touches[1]),
          startMidX: midX,
          startMidY: midY,
          startScale: scaleRef.current,
          startTranslate: { ...translateRef.current },
        };
      }
    };

    const handleTouchMove = (e) => {
      if (!gestureRef.current) return;

      if (gestureRef.current.type === "pan1" && e.touches.length === 1) {
        const dx = e.touches[0].clientX - gestureRef.current.startX;
        const dy = e.touches[0].clientY - gestureRef.current.startY;
        const dist = Math.hypot(dx, dy);

        if (!gestureRef.current.isPanning && dist < TAP_THRESHOLD) return; // まだタップ範囲内

        // 閾値を超えたらパン開始
        e.preventDefault();
        gestureRef.current.isPanning = true;
        const tx = gestureRef.current.startTranslate.x + dx;
        const ty = gestureRef.current.startTranslate.y + dy;
        setTranslate(clampTranslate(tx, ty, scaleRef.current));

      } else if (gestureRef.current.type === "pinch" && e.touches.length === 2) {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        const newDist = getDist(e.touches[0], e.touches[1]);
        const ratio = newDist / gestureRef.current.dist;
        const newScale = Math.min(4, Math.max(minScaleRef.current, gestureRef.current.startScale * ratio));
        const scaleChange = newScale / gestureRef.current.startScale;
        const { startMidX, startMidY, startTranslate } = gestureRef.current;
        const tx = startTranslate.x * scaleChange + startMidX * (1 - scaleChange);
        const ty = startTranslate.y * scaleChange + startMidY * (1 - scaleChange);
        setScale(newScale);
        setTranslate(clampTranslate(tx, ty, newScale));
      }
    };

    const handleTouchEnd = () => { gestureRef.current = null; };

    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [clampTranslate]);

  // ===== PC操作 =====
  // Ctrl+ホイール：ズーム、左クリックドラッグ：移動
  const onWheel = (e) => {
    if (!e.ctrlKey) return; // Ctrlなしは無視
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(4, Math.max(minScaleRef.current, scale * delta));
    const scaleChange = newScale / scale;
    setScale(newScale);
    setTranslate(prev => {
      const rawTx = mouseX - scaleChange * (mouseX - prev.x);
      const rawTy = mouseY - scaleChange * (mouseY - prev.y);
      return clampTranslate(rawTx, rawTy, newScale);
    });
  };

  const onMouseDown = (e) => {
    if (e.button !== 0) return; // 左クリックのみ
    e.preventDefault();
    gestureRef.current = {
      type: "mousepan",
      startX: e.clientX,
      startY: e.clientY,
      startTranslate: { ...translate },
    };
  };

  const onMouseMove = (e) => {
    if (!gestureRef.current || gestureRef.current.type !== "mousepan") return;
    const rawTx = gestureRef.current.startTranslate.x + (e.clientX - gestureRef.current.startX);
    const rawTy = gestureRef.current.startTranslate.y + (e.clientY - gestureRef.current.startY);
    setTranslate(clampTranslate(rawTx, rawTy, scale));
  };

  const onMouseUp = () => { gestureRef.current = null; };

  const resetZoom = () => calcFitScale();

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div
        ref={containerRef}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          overflow: "hidden",
          touchAction: "none",
          cursor: gestureRef.current?.type === "mousepan" ? "grabbing" : scale > 1 ? "grab" : "default",
          userSelect: "none",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          display: "inline-block",
          willChange: "transform",
        }}>
          {children}
        </div>
      </div>
      {scale !== 1 && (
        <button onClick={resetZoom} style={{
          position: "absolute",
          top: 8, right: 8,
          background: "#ffffff",
          border: "1px solid #ff9e00",
          borderRadius: 6,
          padding: "6px 10px",
          color: "#ff9e00",
          fontFamily: "monospace",
          fontSize: 11,
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          zIndex: 10,
        }}>⟲ リセット</button>
      )}
    </div>
  );
}

function FloorMap({ floor, checkedBooths, onBoothClick }) {
  const grid = floor === "1F" ? MAP_1F : MAP_3F;
  const ROWS = grid.length;
  const COLS = Math.max(...grid.map(r => r.length));
  const CELL = 9;
  const PAD = 10;

  const booths = useMemo(() => extractBooths(grid), [grid]);
  const highlightedBooths = new Set(checkedBooths);

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <svg width={COLS * CELL + PAD * 2} height={ROWS * CELL + PAD * 2} style={{ display: "block" }}>
        <rect x={0} y={0} width={COLS * CELL + PAD * 2} height={ROWS * CELL + PAD * 2} fill="#f8f8f8" />

        {/* 軽量グリッド（SVGパターン1要素のみ） */}
        <defs>
          <pattern id={`grid-${floor}`} width={CELL} height={CELL} patternUnits="userSpaceOnUse" x={PAD} y={PAD}>
            <path d={`M ${CELL} 0 L 0 0 0 ${CELL}`} fill="none" stroke="#e0e0e0" strokeWidth={0.3} />
          </pattern>
        </defs>
        <rect x={PAD} y={PAD} width={COLS * CELL} height={ROWS * CELL} fill={`url(#grid-${floor})`} />

        {/* ブース・ステージ・入退場口 */}
        {booths.map(({ id, minR, maxR, minC, maxC }) => {
          const x = PAD + minC * CELL;
          const y = PAD + minR * CELL;
          const w = (maxC - minC + 1) * CELL;
          const h = (maxR - minR + 1) * CELL;
          const isStage = id === "stage";
          const isEntrance = id === "Entrance";
          const isExit = id === "Exit";
          const isPillar = id === "pillar";
          const isBF = id === "BF";
          const isBSGJ = id === "3F-BSGJ";
          const isGCG = id === "3F-GCG";
          const isSpecial = isStage || isEntrance || isExit || isPillar || isBF || isBSGJ || isGCG;
          const isHighlighted = highlightedBooths.has(id);
          const hasGames = GAMES.some(g => g.booth === id);

          const fill = isHighlighted ? "#ff9e00"
            : isStage ? "#ddeeff"
            : isEntrance ? "#d4f5e2"
            : isExit ? "#eeeeee"
            : isPillar ? "#cccccc"
            : isBF ? "#ffeedd"
                        : isBSGJ ? "#e8e0ff"
            : isGCG ? "#ffe8e8"
            : hasGames ? "#fff8ee"
            : "#f8f8f8";

          const stroke = isHighlighted ? "#e07000"
            : isStage ? "#6ab0e0"
            : isEntrance ? "#40bb70"
            : isExit ? "#aaaaaa"
            : isPillar ? "#999999"
            : isBF ? "#ffaa66"
                        : isBSGJ ? "#8866cc"
            : isGCG ? "#cc6677"
            : hasGames ? "#ff9e00"
            : "#e0e0e0";

          const textColor = isHighlighted ? "#fff"
            : isStage ? "#3a7aaa"
            : isEntrance ? "#207040"
            : isExit ? "#888888"
            : isPillar ? "#666666"
            : isBF ? "#cc5500"
                        : isBSGJ ? "#553388"
            : isGCG ? "#993344"
            : hasGames ? "#cc6600"
            : "#bbbbbb";

          const label = isStage ? `${floor} Stage`
            : isEntrance ? "入場"
            : isExit ? "出口"
            : isPillar ? ""
            : isBF ? "休憩エリア"
                        : isBSGJ ? "BitSummit Game Jam"
            : isGCG ? "ゲームクリエイター甲子園"
            : id;

          const fs = w < 18 || h < 12 ? 5 : w < 30 ? 6 : 7;

          return (
            <g key={`${id}-${minR}-${minC}`}
              style={{ cursor: hasGames ? "pointer" : "default" }}
              onClick={() => hasGames && onBoothClick(id)}>
              <rect x={x+1} y={y+1} width={w-2} height={h-2}
                fill={fill} stroke={stroke}
                strokeWidth={isHighlighted ? 1.5 : 0.8} rx={2} />
              {isHighlighted && (
                <rect x={x+1} y={y+1} width={w-2} height={h-2}
                  fill="#ff9e0033" stroke="#ff9e00" strokeWidth={2} rx={2} />
              )}
              {(w >= 10 || h >= 20) && (() => {
                const isVertical = h > w * 1.5;
                const cx = x + w / 2;
                const cy = y + h / 2;
                const fs2 = Math.min(fs, Math.floor(isVertical ? w * 0.85 : h * 0.85));
                return (
                  <text
                    x={cx} y={cy}
                    fill={textColor}
                    fontSize={Math.max(4, fs2)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="monospace"
                    transform={isVertical ? `rotate(-90, ${cx}, ${cy})` : undefined}
                    style={{ userSelect:"none", pointerEvents:"none" }}>
                    {label}
                  </text>
                );
              })()}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function App() {
  // ページ全体のピンチズームを無効化
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    const original = meta ? meta.getAttribute("content") : null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
    return () => {
      if (original !== null) meta.setAttribute("content", original);
    };
  }, []);

  const [searchText, setSearchText] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("すべて");
  const [selectedFloor, setSelectedFloor] = useState("すべて");
  const [checkedIds, setCheckedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("bitsummit-checked");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [activeTab, setActiveTab] = useState("list"); // 'list' | 'map'
  const [mapFloor, setMapFloor] = useState("1F"); // "1F" | "3F" | "checklist"
  const [mapZoomTarget, setMapZoomTarget] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalSource, setModalSource] = useState("list"); // "list" | "checklist"

  // 各絞り込みの件数を計算
  const counts = useMemo(() => ({
    "すべて": GAMES.length,
    "選択中": checkedIds.size,
    "1F": GAMES.filter(g => g.floor === "1F").length,
    "3F": GAMES.filter(g => g.floor === "3F").length,
  }), [checkedIds]);

  const filtered = useMemo(() => {
    return GAMES.filter(g => {
      const q = searchText.toLowerCase();
      const matchText = searchText === "" ||
        g.title.toLowerCase().includes(q) ||
        g.exhibitor.toLowerCase().includes(q) ||
        g.booth.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q);
      const matchGenre = selectedGenre === "すべて" || g.genre === selectedGenre;
      const matchFloor = selectedFloor === "すべて"
        || (selectedFloor === "選択中" && checkedIds.has(g.id))
        || g.floor === selectedFloor;
      return matchText && matchGenre && matchFloor;
    });
  }, [searchText, selectedGenre, selectedFloor]);

  const toggleCheck = (id) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem("bitsummit-checked", JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const checkedBooths = useMemo(() => {
    return new Set(
      GAMES.filter(g => checkedIds.has(g.id)).map(g => g.booth)
    );
  }, [checkedIds]);

  const handleBoothClick = (boothId) => {
    const games = GAMES.filter(g => g.booth === boothId);
    if (games.length > 0) { setSelectedGame(games[0]); setModalSource("map"); }
  };

  return (
    <div style={{
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      background: "#ffffff",
      color: "#222222",
      fontFamily: "'Courier New', monospace",
      touchAction: "pan-x pan-y",
    }}>
      {/* Header */}
      <div style={{
        background: "#ffffff",
        borderBottom: "2px solid #ff9e00",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          background: "#ff9e00",
          color: "#fff",
          fontWeight: "900",
          fontSize: 13,
          padding: "4px 10px",
          borderRadius: 3,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}>PUNCH</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: "bold", color: "#00e5c8", letterSpacing: 1 }}>
            BITSUMMIT PUNCH
          </div>
          <div style={{ fontSize: 10, color: "#4a8a80", letterSpacing: 2 }}>
            2026.5.22–24 · MIYAKO MESSE KYOTO
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: "#ff9e00" }}>
          ✓ {checkedIds.size} チェック済み
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #eeeeee",
        background: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 95,
      }}>
        {["list", "map"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid #ff9e00" : "2px solid transparent",
              color: activeTab === tab ? "#ff9e00" : "#999999",
              fontFamily: "monospace",
              fontSize: 12,
              letterSpacing: 2,
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}>
            {tab === "list" ? "🎮 タイトル一覧" : "🗺 会場マップ"}
          </button>
        ))}
      </div>

      {/* LIST TAB */}
      {activeTab === "list" && (
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{
            background: "#ffffff",
            borderBottom: "1px solid #eeeeee",
            padding: "0 16px 4px",
          }}>
          {/* Search */}
          <input
            type="text"
            placeholder="タイトル・出展社・ブース番号・説明文で検索..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 14px",
              background: "#ffffff",
              border: "1px solid #dddddd",
              borderRadius: 6,
              color: "#222222",
              fontFamily: "monospace",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
              marginTop: 8,
              marginBottom: 8,
            }}
          />

          {/* Filters */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 4 }}>
            {/* Genre filter */}
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 10px",
                background: "#ffffff",
                border: "1px solid #dddddd",
                borderRadius: 5,
                color: "#444444",
                fontFamily: "monospace",
                fontSize: 11,
                cursor: "pointer",
                boxSizing: "border-box",
              }}>
              <option>すべて</option>
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>

            {/* Floor filter */}
            <div style={{ display: "flex", gap: 6 }}>
              {["すべて", "選択中", "1F", "3F"].map(f => (
                <button key={f} onClick={() => setSelectedFloor(f)}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    background: selectedFloor === f ? "#ff9e00" : "#ffffff",
                    border: `1px solid ${selectedFloor === f ? "#ff9e00" : "#dddddd"}`,
                    borderRadius: 5,
                    color: selectedFloor === f ? "#fff" : "#888888",
                    fontFamily: "monospace",
                    fontSize: 10,
                    cursor: "pointer",
                    lineHeight: 1.4,
                  }}>
                  <div>{f}</div>
                  <div style={{ fontSize: 10, opacity: 0.85 }}>({counts[f]})</div>
                </button>
              ))}
            </div>
          </div>
          </div>{/* /sticky header */}

          {/* Game list */}
          <div
            id="game-list-scroll"
            style={{
              padding: "4px 16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              overflowY: "auto",
              height: "calc(100vh - 48px - 120px)",
              WebkitOverflowScrolling: "touch",
            }}>
            {filtered.map(game => (
              <div key={game.id}
                onClick={() => { setSelectedGame(game); setModalSource("list"); }}
                style={{
                  background: checkedIds.has(game.id) ? "#fff8ee" : "#fafafa",
                  border: `1px solid ${checkedIds.has(game.id) ? "#ff9e00" : "#eeeeee"}`,
                  borderRadius: 8,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}>
                <div
                  onClick={e => { e.stopPropagation(); toggleCheck(game.id); }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: `2px solid ${checkedIds.has(game.id) ? "#ff9e00" : "#cccccc"}`,
                    background: checkedIds.has(game.id) ? "#ff9e00" : "transparent",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}>
                  {checkedIds.has(game.id) && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: "bold", color: "#222222", marginBottom: 3 }}>
                    {game.title}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{
                      fontSize: 9, padding: "2px 7px",
                      background: "#fff8ee", border: "1px solid #ff9e00",
                      borderRadius: 3, color: "#cc6600", letterSpacing: 1,
                    }}>{game.booth}</span>
                    <span style={{
                      fontSize: 9, padding: "2px 7px",
                      background: "#f5f0ff", border: "1px solid #bb88dd",
                      borderRadius: 3, color: "#8844aa",
                    }}>{game.genre}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#888888" }}>{game.exhibitor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* トップへ戻るボタン（タイトル一覧タブのみ） */}
      {activeTab === "list" && (
        <button
          onClick={() => {
            const el = document.getElementById("game-list-scroll");
            if (el) el.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            position: "fixed",
            bottom: 24,
            right: 20,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#ff9e00",
            border: "none",
            color: "#ffffff",
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 80,
          }}>
          ↑
        </button>
      )}

      {/* MAP TAB */}
      {activeTab === "map" && (
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* 3タブ切替（ボタン形式） - sticky */}
          <div style={{
            display: "flex",
            gap: 8,
            padding: "10px 16px",
            background: "#ffffff",
            borderBottom: "1px solid #eeeeee",
          }}>
            {[
              { key: "1F", label: "1F" },
              { key: "3F", label: "3F" },
              { key: "checklist", label: checkedIds.size > 0 ? "✓ リスト (" + checkedIds.size + ")" : "✓ リスト" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setMapFloor(tab.key)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  background: mapFloor === tab.key ? "#ff9e00" : "#ffffff",
                  border: `1px solid ${mapFloor === tab.key ? "#ff9e00" : "#dddddd"}`,
                  borderRadius: 6,
                  color: mapFloor === tab.key ? "#ffffff" : "#888888",
                  fontFamily: "monospace",
                  fontSize: 12,
                  fontWeight: "bold",
                  cursor: "pointer",
                  letterSpacing: 1,
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* マップ表示 or チェックリスト */}
          {mapFloor !== "checklist" ? (
            <div style={{
              overflowY: "auto",
              overflowX: "hidden",
              height: "calc(100vh - 48px - 50px)",
              WebkitOverflowScrolling: "touch",
            }}>
              <MapZoomContainer floor={mapFloor} zoomTarget={mapZoomTarget}>
                <FloorMap
                  floor={mapFloor}
                  checkedBooths={checkedBooths}
                  onBoothClick={handleBoothClick}
                />
              </MapZoomContainer>


            </div>
          ) : (
            /* チェックリストタブ */
            <div style={{
              overflowY: "auto",
              height: "calc(100vh - 48px - 50px)",
              WebkitOverflowScrolling: "touch",
              padding: "12px 16px",
            }}>
              {checkedIds.size === 0 ? (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50%",
                  color: "#aaaaaa",
                  fontSize: 13,
                  gap: 8,
                }}>
                  <div style={{ fontSize: 32 }}>✓</div>
                  <div>チェックしたタイトルがここに表示されます</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 10, color: "#ff9e00", letterSpacing: 2, marginBottom: 12 }}>
                    ✓ チェックリスト（{checkedIds.size}件）
                  </div>
                  {GAMES.filter(g => checkedIds.has(g.id)).map(g => (
                    <div key={g.id}
                      onClick={() => { setSelectedGame(g); setModalSource("checklist"); }}
                      style={{
                        background: "#fff8ee",
                        border: "1px solid #ff9e00",
                        borderRadius: 8,
                        padding: "12px 14px",
                        marginBottom: 8,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                      }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: "bold", color: "#222222", marginBottom: 4 }}>{g.title}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: 9, padding: "2px 7px",
                            background: "#ffffff", border: "1px solid #ff9e00",
                            borderRadius: 3, color: "#cc6600", letterSpacing: 1,
                          }}>{g.booth}</span>
                          <span style={{
                            fontSize: 9, padding: "2px 7px",
                            background: "#f5f0ff", border: "1px solid #bb88dd",
                            borderRadius: 3, color: "#8844aa",
                          }}>{g.genre}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#888888", marginTop: 3 }}>{g.exhibitor}</div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); toggleCheck(g.id); }}
                        style={{
                          background: "none", border: "none",
                          color: "#ff9e00", fontSize: 20, cursor: "pointer",
                          paddingLeft: 12, flexShrink: 0,
                        }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Game detail modal */}
      {selectedGame && (
        <div
          onClick={() => setSelectedGame(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "flex-end",
            zIndex: 200,
          }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%",
              background: "#0a1414",
              border: "1px solid #0a4a4a",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: "24px 20px 32px",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: "bold", color: "#ffffff", marginBottom: 8, lineHeight: 1.4 }}>
                  {selectedGame.title}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 10, padding: "3px 9px",
                    background: "#fff8ee", border: "1px solid #ff9e00",
                    borderRadius: 3, color: "#cc6600", letterSpacing: 1,
                  }}>{selectedGame.booth}</span>
                  <span style={{
                    fontSize: 10, padding: "3px 9px",
                    background: "#f5f0ff", border: "1px solid #bb88dd",
                    borderRadius: 3, color: "#8844aa",
                  }}>{selectedGame.genre}</span>
                </div>
              </div>
              <button onClick={() => setSelectedGame(null)}
                style={{ background: "none", border: "none", color: "#aaaaaa", fontSize: 20, cursor: "pointer", padding: 4 }}>
                ✕
              </button>
            </div>

            <div style={{ fontSize: 11, color: "#888888", marginBottom: 12 }}>
              出展社：{selectedGame.exhibitor}
            </div>
            <div style={{ fontSize: 13, color: "#ffffff", lineHeight: 1.7, marginBottom: 20 }}>
              {selectedGame.description}
            </div>

            <button
              onClick={() => { toggleCheck(selectedGame.id); setSelectedGame(null); }}
              style={{
                width: "100%",
                padding: "14px 0",
                background: checkedIds.has(selectedGame.id) ? "#fff8ee" : "#ff9e00",
                border: `2px solid ${checkedIds.has(selectedGame.id) ? "#ff9e00" : "#ff9e00"}`,
                borderRadius: 8,
                color: checkedIds.has(selectedGame.id) ? "#ff9e00" : "#fff",
                fontFamily: "monospace",
                fontSize: 13,
                fontWeight: "bold",
                cursor: "pointer",
                letterSpacing: 1,
              }}>
              {checkedIds.has(selectedGame.id) ? "✓ チェックを外す" : "+ チェックリストに追加"}
            </button>
            {selectedGame.floor !== "未定" && modalSource === "checklist" && (
              <button
                onClick={() => {
                  setActiveTab("map");
                  setMapFloor(selectedGame.floor);
                  setMapZoomTarget({ boothId: selectedGame.booth, floor: selectedGame.floor });
                  setSelectedGame(null);
                }}
                style={{
                  width: "100%",
                  marginTop: 10,
                  padding: "14px 0",
                  background: "#ffffff",
                  border: "2px solid #ff9e00",
                  borderRadius: 8,
                  color: "#ff9e00",
                  fontFamily: "monospace",
                  fontSize: 13,
                  fontWeight: "bold",
                  cursor: "pointer",
                  letterSpacing: 1,
                }}>
                🗺 マップでブースを見る
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
