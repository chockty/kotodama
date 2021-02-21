class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: [:line]
  validates :nickname, presence: true

  has_one :lineaccount, dependent: :destroy
  has_many :diaries, dependent: :destroy
  has_one :function, dependent: :destroy
  has_many :memos, dependent: :destroy

  def self.from_omniauth(auth)
    # ①
    # ここでLINE認証したことがあるか（＝LINEのユーザIDの登録があるか）を確認する
    # first_or_create：データがあればインスタンスに返す。なければDBへデータを保存する。
    # しかし、ここではユーザへ紐づいていない（userが外部キーなので基本的に必須）ので、後ほど紐付ける。
    sns = Lineaccount.where(uid: auth.uid)
    if sns = []
      sns = Lineaccount.new(uid: auth.uid)
    else
      return {sns: sns}
    end
    # ②
    # ここでLINEから送られてきた情報（auth）にemailが含まれているか確認。
    # 含まれている場合は、emailで検索をかける。登録されたユーザがDBにあるか確認
    # あればその情報を持ってくる。なければauthの情報を基にインスタンスを生成する。
    if auth.info.email
      user = User.where(email: auth.info.email).first_or_initialize(
        nickname: auth.info.name,
          email: auth.info.email
      )
    # authにemailが含まれない場合は、emailに空の値を入れてインスタンスを作成する。
    else
      user = User.new(nickname: auth.info.name, email: "")
    end
    return {user: user, sns: sns}
  end
end