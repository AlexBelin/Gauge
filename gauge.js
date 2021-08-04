class Gauge {
    constructor(Target, ConfigObj) {
        this.Target = Target;
        this.ConfigObj = ConfigObj;
        this.Value = 0;
        this.Canvas = document.createElement('canvas');
        this.Incr = 0;
        if(this.ConfigObj.speed.toString().indexOf('.') != -1) {
            if(this.ConfigObj.speed.toString().split(".")[1].length <= 2) {
                this.Round = 100;
            }
            else{
                this.Round = Math.pow(10, this.ConfigObj.speed.toString().split(".")[1].length);
            }
        }
        else {
            this.Round = 100;
        }
        this.AnimGauge = null;
        this.ctx = this.Canvas.getContext('2d');
    }

    Render() {
        this.Target.appendChild(this.Canvas);
        this.ctx.lineWidth = this.ConfigObj.stroke;
        this.ctx.strokeStyle = this.ConfigObj.color;
    }

    Refresh(_Value, _ReferenceValue) {
        window.clearInterval(this.AnimGauge);
        if(_Value > _ReferenceValue) {
            _Value = _ReferenceValue;
        }
        if(_Value < 0) {
            _Value = 0;
        }
        if(_Value < this.Value) {
            this.Incr = this.ConfigObj.speed * -1;
        }
        else {
            this.Incr = this.ConfigObj.speed;
        }
        this.RenderGauge(_Value, _ReferenceValue);
    }

    RenderGauge(_Value, _ReferenceValue) {
        this.AnimGauge = setInterval(() => {
            this.DrawGauge(_Value, _ReferenceValue)
            if(this.Value != _Value) {
                if(Math.abs(this.Value - _Value) < Math.abs(this.Incr)) {
                    this.Value = _Value;
                }
                else {
                    this.Value = Math.round(((this.Value + this.Incr) + Number.EPSILON) * this.Round) / this.Round;
                }
            }
        });
    }
}

class GaugeLine extends Gauge {
    constructor(Target, ConfigObj) {
        super(Target, ConfigObj);
        this.CanvasWidth = this.ConfigObj.width;
        if(this.ConfigObj.displayValue) {
            this.CanvasHeight = this.ConfigObj.stroke + parseInt(this.ConfigObj.displayValue.replace( /^\D+/g, '')) + 4;
        }
        else {
            this.CanvasHeight = this.ConfigObj.stroke;
        }
        this.Canvas.setAttribute('width', this.CanvasWidth);
        this.Canvas.setAttribute('height', this.CanvasHeight);
    }

    DrawGauge(_Value, _ReferenceValue) {
        this.ctx.clearRect(0, 0, this.CanvasWidth, this.CanvasHeight);
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.CanvasHeight - (this.ConfigObj.stroke / 2));
        this.ctx.lineTo(this.Value * this.CanvasWidth / _ReferenceValue, this.CanvasHeight - (this.ConfigObj.stroke / 2));
        if(this.ConfigObj.displayValue) {
            this.ctx.font = this.ConfigObj.displayValue;
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'top';
            if((this.Value / _Value) > 0.5) {
                var _X_TextPlace = this.Value * this.CanvasWidth / _ReferenceValue;
            }
            else {
                var _X_TextPlace = (this.Value * this.CanvasWidth / _ReferenceValue) + 30;
            }
            this.ctx.fillText(this.Value + '/' + _ReferenceValue, _X_TextPlace, 0);
            if(this.ConfigObj.textColor) {
                this.ctx.fillStyle = this.ConfigObj.textColor;
            }
        }
        this.ctx.stroke();
    }
}

class GaugeCirc extends Gauge {
    constructor(Target, ConfigObj) {
        super(Target, ConfigObj);
        this.CanvasDim = (this.ConfigObj.radius + this.ConfigObj.stroke) * 2;
        this.Canvas.setAttribute('width', this.CanvasDim);
        this.Canvas.setAttribute('height', this.CanvasDim);
    }

    DrawGauge(_Value, _ReferenceValue) {
        this.ctx.clearRect(0, 0, this.CanvasDim, this.CanvasDim);
        this.ctx.beginPath();
        this.ctx.arc(this.CanvasDim / 2, this.CanvasDim / 2, this.ConfigObj.radius, 0, ((this.Value * 2) / _ReferenceValue) * Math.PI);
        if(this.ConfigObj.displayValue) {
            this.ctx.font = this.ConfigObj.displayValue;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.Value + '/' + _ReferenceValue, this.CanvasDim / 2, this.CanvasDim / 2);
            if(this.ConfigObj.textColor) {
                this.ctx.fillStyle = this.ConfigObj.textColor;
            }
        }
        this.ctx.stroke();
    }
}