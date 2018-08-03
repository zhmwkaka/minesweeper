var Start = function (col, row, num_bomb, icons) {
    // icons: 0, 1, 2, 3, 4, 5, 6, 7, 8, mask, flag, bomb, win, lose, ing
    //        0, 1, 2, 3, 4, 5, 6, 7, 8, 9   , 10  , 11  , 12 , 13  , 14
    this.col = col
    this.row = row
    this.num_bomb = num_bomb
    this.map = document.getElementById('map')
    this.header = document.getElementById('header')
    this.icons = icons
    this.headertext = new Array ()
    this.base = document.createElement('div')
    this.base.className = 'cell mask z-depth-1'
    this.firstclick = false

    this.init()
}

Start.prototype.init = function () {
    var that = this
    this.num_cell = this.col * this.row
    this.map.className = ''
    this.header.className = 'z-depth-1'
    this.header.classList.add('normal')
    this.headertext.push(this.icons[14])
    this.headertext.push('BOMB ')
    this.headertext.push('' + this.num_bomb)
    this.header.innerHTML = this.headertext.join('')
    this.map.innerHTML = ''
    this.array().forEach(function(a, i) {
        var y = Math.ceil((i + 1) / that.col)
        var x = Math.floor((i + 1) % that.col) || that.col
        var mine = that.mine(a)
        mine.classList.add('x' + x, 'y' + y)
        mine.neighbors = [('.x' + x + '.y' + (y + 1)), ('.x' + (x + 1) + '.y' + (y + 1)), ('.x' + (x - 1) + '.y' + (y + 1)), ('.x' + (x + 1) + '.y' + y),
                          ('.x' + x + '.y' + (y - 1)), ('.x' + (x + 1) + '.y' + (y - 1)), ('.x' + (x - 1) + '.y' + (y - 1)), ('.x' + (x - 1) + '.y' + y)]
        that.map.appendChild(mine)
        if (x == that.col)
            that.map.appendChild(document.createElement('br'))
    })
    this.setclickevents()
}

Start.prototype.setclickevents = function () {
    var that = this
    var cells = document.getElementsByClassName('cell')
    Array.prototype.forEach.call(cells, function (cell) {
        cell.addEventListener('click', function () {
            if (!that.firstclick) {
                if (cell.bomb) {
                    var buf = cell.classList
                    buf.remove('mask')
                    buf.remove('cell')
                    buf.remove('z-depth-1')
                    var tarcell = '.' + buf[0] + '.' + buf[1]
                    that.reset()
                    that.init()
                    document.querySelector(tarcell).dispatchEvent(new MouseEvent('click'))
                    return
                }
                that.firstclick = true
            }
            that.onclickcell(cell)
//            if (that.wincheck()) {
//                that.end(true)
//            }   
        })
        cell.addEventListener('dblclick', function () {
            {
            var neighbors = document.querySelectorAll(cell.neighbors)
            var masks = Array.prototype.filter.call(neighbors, function (cell) { return cell.mask })
            if (masks.length == 0) {
                return  
            }
            if (Array.prototype.filter.call(neighbors, function (cell) { return cell.flag }).length != Array.prototype.filter.call(neighbors, function (cell) { return cell.bomb }).length) {
                return
            }
            Array.prototype.forEach.call(masks, function (cell) {
                setTimeout(function () {that.onclickcell(cell)}, 0) 
            })
            }
//            if (that.wincheck()) {
//                that.end(true)
//            }
        })
        cell.addEventListener('contextmenu', function (evt) {
            evt.preventDefault()
            if (!that.firstclick) {
                that.firstclick = true
            }
            var num
            var clist = cell.classList
            if (cell.mask && !cell.flag) {
                clist.remove('mask')
                clist.add('bomb')
                cell.innerHTML = that.icons[10]
                cell.mask = false
                cell.flag = true
                that.headertext.pop()
                num = that.num_bomb - Array.prototype.filter.call(document.getElementsByClassName('cell'), function (cell) { return cell.flag }).length
                that.headertext.push('' + (num > 0 ? num : 0))
                that.header.innerHTML = that.headertext.join('')
            }
            else if (cell.flag) {
                clist.remove('bomb')
                clist.add('mask')
                cell.innerHTML = that.icons[9]
                cell.mask = true
                cell.flag = false
                that.headertext.pop()
                num = that.num_bomb - Array.prototype.filter.call(document.getElementsByClassName('cell'), function (cell) { return cell.flag }).length
                that.headertext.push('' + (num > 0 ? num : 0))
                that.header.innerHTML = that.headertext.join('')
            }
            if (that.wincheck()) {
                that.end(true);
            }
        })
    })
    this.header.addEventListener('click', function () {
        if (document.getElementsByClassName('win').length != 0 || document.getElementsByClassName('lose').length != 0) {
            that.reset()
            that.init()
        }
    })
}

Start.prototype.mine = function (e) {
    var base = this.base.cloneNode(true)
    base.innerHTML = this.icons[9]
    base.mask = true
    base.flag = false
    base.bomb = e
    return base
}

Start.prototype.array = function () {
    var arr = []
    var i = 0
    for (; i < this.num_bomb; i++) {
        arr.push(true)
    }
    for (; i < this.num_cell; i++) {
        arr.push(false)
    }
    return this.shuffle(arr)
}

Start.prototype.shuffle = function (arr) {
    for (var n = arr.length - 1; n >= 0; n--) {
        var rindex = Math.floor(Math.random() * n)
        var t = arr[n]
        arr[n] = arr[rindex]
        arr[rindex] = t
    }
    return arr
}

Start.prototype.end = function (win) {
    if (win) {
        var that = this
        Array.prototype.forEach.call(Array.prototype.filter.call(document.getElementsByClassName('cell'), function (cell) { return cell.mask }), function (cell) {
            var clist = cell.classList
            clist.remove('mask')
            clist.add('bomb')
            cell.innerHTML = that.icons[10]
            cell.mask = false
            cell.flag = true
        })
        this.headertext.pop()
        this.headertext.push('' + 0)
        this.header.innerHTML = this.headertext.join('')
        this.map.classList.add('win')
        this.header.classList.remove('normal')
        this.header.classList.add('win')
        this.header.innerHTML = this.icons[12]
    }
    else {
        this.map.classList.add('win')
        this.header.classList.remove('normal')
        this.header.classList.add('lose')
        this.header.innerHTML = this.icons[13]
    }
}

Start.prototype.reset = function () {
    var that = this
    this.headertext = []
    this.firstclick = false
    Array.prototype.forEach.call(document.getElementsByClassName('cell'), function (cell) { that.map.removeChild(cell) })
}

Start.prototype.wincheck = function () {
    var cells = document.getElementsByClassName('cell')
    var masks = Array.prototype.filter.call(cells, function (cell) { return cell.mask })
    var flags = Array.prototype.filter.call(cells, function (cell) { return cell.flag })
    if (masks.length + flags.length != this.num_bomb) {
        return false
    }
    if (masks.length == 0) {
        return true
    }
    return Array.prototype.filter.call(flags, function (cell) { return !cell.bomb }).length == 0
}

Start.prototype.onclickcell = function(thiscell) {
    var that = this
    if (!thiscell.mask) { return }
    thiscell.mask = false
    var clist = thiscell.classList;
    if (thiscell.bomb) {
        thiscell.innerHTML = this.icons[11]
        clist.remove('mask')
        clist.add('bomb')
        Array.prototype.forEach.call(Array.prototype.filter.call(document.getElementsByClassName('cell'), function (cell) {return cell.mask || cell.flag}), function (cell) {
            if (cell.flag) {
                cell.flag = false
            }
            var clist = cell.classList
            if (cell.bomb) {
                clist.remove('mask')
                clist.add('bomb')
                cell.innerHTML = that.icons[11]
            }
            else {
                clist.remove('mask')
                clist.remove('bomb')
                clist.add('num')
                cell.innerHTML = that.icons[Array.prototype.filter.call(document.querySelectorAll(cell.neighbors), function (cell) { return cell.bomb }).length]
            }
        })
        this.end(false);
    }
    else {
        var n = Array.prototype.filter.call(document.querySelectorAll(thiscell.neighbors), function (cell) { return cell.bomb }).length
        clist.remove('mask')
        clist.add('num')
        thiscell.innerHTML = this.icons[n]
        if (n == 0) {
            thiscell.dispatchEvent(new MouseEvent('dblclick'))
        }
    }
    if (this.wincheck()) {
        this.end(true)
    }
}