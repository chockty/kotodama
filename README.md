# README

## アプリケーション概要

このアプリケーションは、ユーザに「ジャーナリングを習慣化」して頂くためのアプリケーションです。
主な機能は以下の通りです。

①LINE chatbot 連携機能
独自に開発した本アプリケーション用のLINE chat botを連携ができるようになっております。
主な機能は機能の通りです。
・ユーザ登録時にLINE アカウントを利用可能
・日記投稿/メモ投稿をLINE chat botから利用可能
・LINE chat bot から通知が届くリマインド機能を利用可能

②日記投稿機能
ジャーナリングを日々の習慣にして頂くよう、2つの質問を用意し、
その質問に対して日記を投稿頂く仕組みとなっております。
Webアプリケーション、LINE chat botどちらからでも投稿可能です。
無理なく習慣化するために、投稿は一日１回（問いが2つのため厳密には2回）とルールを制限しております。

③メモ投稿機能
日々の日記投稿以外に、自分で気づいたことをメモしておく機能があります。
メモは無制限なので、日記とは別に思ったことを自由に書いて頂くことができます。

④リマインド機能（今後コードで実装予定）
メールもしくはLINE chat botを活用したリマインドをかけることが可能です。
リマインドの時間は一律で20:00となっており、リマインドのOFF/ONはwebアプリケーションのユーザ情報画面にて
設定可能です。
（LINE の通知を使用する場合は、LINE chat botとの友達登録が必要です。）

⑤閲覧機能
投稿した日記/メモはwebアプリケーションから閲覧可能です。
トップページでは今日を基準として前後3日間の投稿を、ボタン切替で閲覧可能です。
過去の投稿を参照したい場合は、「キーワード検索」「日付検索」にて検索可能です。


## 目指した課題解決
このアプリケーションでは、「自分1人で前向きになるサポートをする」目的で作りました。
自身の経験から、「自分のことをちゃんと知ること」が「自分が前向きになる方法の一つ」と考え、その手法として、私も活用していたジャーナリングという方法を選択しました。

対象には主に2つのパターンがあります。

1つ目は、病院に行くほどではないにしても、イマイチ気分が落ち込み物事への活力が沸かないタイプです。
ふと休日に「あれ？時間あるけど何したいんだろ自分？」「なんだか仕事のことばかり考えてしまって休まらないな。。」となることがあると思います。
普段仕事を頑張っているからこそ、自分の素直な気持ちに蓋をしなければいけないことはたくさんあると思います。
しかし、そんなに頑張って生きているのに、自分の時間になったら落ち込んでしまうなんて勿体ないです。

私も同じ経験がありました。そんな時に我流でジャーナリングを始めて、自分の素直な気持ちを言語化することができました。結果的に、休日をブルーな気持ちで終わらせるのではなく、自分のやりたいことに時間を使えるようになりました。

2つ目は、何かやりたいというエネルギーがあるのに、何をしたいのかわからないタイプです。
エネルギーがあるのに自分が何をしたいのか分からないままだと、とても勿体ないことになります。いざ挑戦して、自分の思いとは別のところに来てしまったということもあると思います。

2社目の転職活動をしている際に、自分は結局のところどんなことがしたいのか。そんなことをずっと考えていた時期がありました。その時期は思いつくままに紙に考えていることを書いて自分の考えを整理していました。正直なところ、まだやりたいことをはっきりを喋ることはできませんが、自分は「黙々と取り組みたい」「新しいことを勉強し続けたい」という気持ちがあることに気づき、IT業界への転職を心に決めたということがありました。

以上のことから、自分の思いを言語化していく、ジャーナリングを習慣化できれば、たとえ周りに自分の内面を打ち明けられなくとも、自分の力で前向きになれると考えてアプリケーションを開発しようと思いました。


## 機能説明詳細
①LINE login
LINE連携機能の一つとして採用しているLINE loginのデモ映像です。

（流れ）
トップ画面〜新規登録画面〜LINE login実施〜ユーザのindex画面

![result](https://user-images.githubusercontent.com/75976150/108626795-6518b800-7495-11eb-9ea8-b6860e11c128.gif)


②LINE chat bot
LINE chat botからの投稿、及びトップページへのデモ映像です。

![result](https://user-images.githubusercontent.com/75976150/108628007-bb88f500-749b-11eb-96cb-b4ccc10c3de6.gif)
![result](https://user-images.githubusercontent.com/75976150/108628058-fc810980-749b-11eb-841c-094fa64e4023.gif)
![result](https://user-images.githubusercontent.com/75976150/108628083-1b7f9b80-749c-11eb-9fb3-1dc37b957071.gif)


## 利用方法（テスト用アカウント）
後ほど更新します。

## データベース設計
### usersテーブル

| Column                | Type       | Options                   |
| --------------------- | ---------- | ------------------------- |
| nickname              | string     | null: false               |
| email                 | string     | null: false, unique: true |
| encrypted_password    | string     | null: false               |

#### Association
- has_one :lineaccount
- has_one :function
- has_many :diaries
- has_many :memos


### lineaccountsテーブル

| Column                     | Type       | Options                        |
| -------------------------- | ---------- | ------------------------------ |
| uid                        | string     | null: false, unique: true      |
| user                       | references | foreign_key :true              |

#### Association
- belongs_to :user


### functionsテーブル

| Column                     | Type       | Options                        |
| -------------------------- | ---------- | ------------------------------ |
| line_remind                | integer    | null: false                    |
| mail_remind                | integer    | null: false                    |
| diary_mode                 | integer    | null: false                    |
| memo_mode                  | integer    | null: false                    |
| user                       | references | null: false, foreign_key :true |

#### Association
- belongs_to :user


### diariesテーブル

| Column                     | Type       | Options                        |
| -------------------------- | ---------- | ------------------------------ |
| content                    | string     |                                |
| question                   | integer    | null: false                    |
| user                       | references | null: false, foreign_key :true |

#### Association
- belongs_to :user


### memosテーブル

| Column                     | Type       | Options                        |
| -------------------------- | ---------- | ------------------------------ |
| content                    | string     | null: false                    |
| user                       | references | null: false, foreign_key :true |

#### Association
- belongs_to :user
