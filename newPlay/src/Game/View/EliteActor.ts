class EliteActor extends Monster {
	public constructor() {
		super()
	}

	public Init(data:any, type:ELevelType) {
		super.Init(data, type)
		this._changeToUnknown()
	}

	public update(timeElapsed:number) {
		super.update(timeElapsed)
		if (this._knownTime >= 0) {
			this._knownTime += timeElapsed
			if (this._knownTime >= 3000) {
				this._changeToUnknown()
			}
		}
	}

	public summonBeKill() {
		this._summonCount -= 1
		if (this._knownTime < 0) {
			this._summonBeKillCount += 1
		}
		this._summonCount = Math.max(0, this._summonCount)
		if (this._data.Difficult == EMonsterDifficult.SpecialElite1 && this._summonCount <= 0) {
			if (this._summonWave < this._data.Wave) {
				this._changeToKnown()
			}
		}
		if (this._data.Difficult == EMonsterDifficult.SpecialElite2) {
			if (this._summonBeKillCount >= this._data.Count) {
				this._summonBeKillCount = 0
				this._changeToKnown()
			}
		}
	}

	public ballExplosion(a_ball:Balloon) {
		super.ballExplosion(a_ball)
		if (this._data.Difficult == EMonsterDifficult.SpecialElite2) {
			this._knownTime = -1
		}
	}

	protected _spide(data, posX, posY, count, i) {
		let channel = GameVoice.spideBall.play(0, 1)
		channel.volume = GameConfig.soundValue / 100
        PanelManager.gameScenePanel.createSummonActor(this, data, this._ePos, posX, posY, count, i)
	}

	private _eliteSummon() {
		if (GameManager.Instance.gameState == EGameState.Start && this._summonData != undefined) {
			let count = 0
			if (this._summonData.count > 0) count = this._summonData.count
			else count = MathUtils.getRandom(this._summonData.min, this._summonData.max)
			for (let i = 0; i < count; i++) {
				egret.setTimeout(this._spide, this, i*200, this._summonData, this.x, this.y, count, i)
			}
		}
	}

	protected _onArmatureFrame(event:dragonBones.EgretEvent) {
		let evt:string = event.frameLabel
		switch (evt) {
			case "vomit":
				if (this.y < 200) return
				if (this._data.Difficult == EMonsterDifficult.SpecialElite1) {
					if (this._summonCount <= 0 && this._summonWave < this._data.Wave) {
						this._summonWave += 1
						this._eliteSummon()
					}
				}else{
					if (this._knownTime > 0) return
					this._eliteSummon()
				}
			break
		}
	}

	private _changeToUnknown() {
		this._knownTime = -1
		for (let i = 0; i < this.balloons.length; i++) {
			let ball:Balloon = this.balloons[i]
			ball.changeToUnknown()
		}
	}

	private _changeToKnown() {
		if (this._data.Difficult == EMonsterDifficult.SpecialElite2) {
			this._knownTime = 0
		}
		this._balloons[0].changeToKnown()
	}

	private _knownTime:number
}