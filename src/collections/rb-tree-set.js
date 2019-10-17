/**
 *  @template T
 *  @constructor
 *  @param {TreeNode<T>} [parent]
 *  @param {TreeNode<T>} [leftChild]
 *  @param {TreeNode<T>} [rightChild]
 *  @param {T} [element]
 *  @param {boolean} [red]
 */
function TreeNode(parent, leftChild, rightChild, element, red)
{
    this._parent = detail._selectNonUndefined(parent, null);
    this._leftChild = detail._selectNonUndefined(leftChild, null);
    this._rightChild = detail._selectNonUndefined(rightChild, null);
    this._element = detail._selectNonUndefined(element, null);
    this._red = detail._selectNonUndefined(red, false);
};

/**
 *  @readonly
 */
TreeNode.nil = new TreeNode();

/**
 *  @param {TreeNode<T>} node
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.leftChild = function (node)
{
    if(typeof(node) !== "undefined") {
        this._leftChild = node;

        return this;
    }
    else {
        return this._leftChild;
    }
};

/**
 *  @param {TreeNode<T>} node
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.rightChild = function (node)
{
    if(typeof(node) !== "undefined") {
        this._rightChild = node;

        return this;
    }
    else {
        return this._rightChild;
    }
};

/**
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.getRoot = function () {
    var pRoot = this;
    for(
        var pParent = pRoot._parent;
        pParent !== null;
        pRoot = pParent, pParent = pRoot._parent
    );

    return pRoot;
};

/**
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.getGrandParent = function () {
    return (this._parent !== null ? this._parent._parent : null);
};

/**
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.getUncle = function () {
    var pUncle = null;

    var pGrandParent = this.getGrandParent();
    if(pGrandParent !== null) {
        pUncle = (pGrandParent._leftChild === this._parent
            ? pGrandParent._rightChild
            : pGrandParent._leftChild
        );
    }

    return pUncle;
};

/**
 *  @param {TreeNode<T>} parent
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.getSibling = function (parent) {
    if(typeof(parent) === "undefined") {
        return (
            (this._parent !== null)
            ? (
                this === this._parent._leftChild
                ? this._parent._rightChild
                : this._parent._leftChild
                )
            : null
        );
    }
    else {
        var pSibling = null;
        if(this === parent._leftChild) {
            pSibling = parent._rightChild;
        }
        else if(this === parent._rightChild) {
            pSibling = parent._leftChild;
        }

        return pSibling;
    }
};

/**
 *  @returns {Boolean}
 */
TreeNode.prototype.isNil = function () {
    return this._element === null;
};

/**
 *  @returns {Boolean}
 */
TreeNode.prototype.isNonNilRoot = function () {
    return this._parent === null && !this.isNil();
};

/**
 *  @param {Number} index
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.getChild = function (index) {
    var node = null;

    switch(index) {
    case 0:
        node = this._leftChild;
    break;
    case 1:
        node = this._rightChild;
    break;
    default:
        throw new Error("The value of the index must be in [0, 1].");
    }

    return node;
};

/**
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.getLastChild = function () {
    return (this.hasRightChild() ? this._rightChild : this._leftChild);
};

/**
 *  @param {Number} index
 *  @param {TreeNode<T>} pNode
 */
TreeNode.prototype.setChild = function (index, pNode) {
    var pDetachedChild = null;

    switch(index) {
    case 0:
        if(this.hasNonNilLeftChild()) {
            pDetachedChild = this._leftChild;
            this._leftChild._parent = null;
        }
        this._leftChild = pNode;
    break;
    case 1:
        if(hasNonNilRightChild()) {
            pDetachedChild = this._rightChild;
            this._rightChild._parent = null;
        }
        this._rightChild = pNode;
    break;
    default:
        throw new Error("The range of the index must be [0, 1].");
    }

    if(pNode) {
        if(pNode._parent !== null) {
            pNode.getChildSlot().call(pNode._parent, null);
        }
        pNode._parent = this;
    }

    return pDetachedChild;
};

/**
 *  @returns {Number}
 */
TreeNode.prototype.getChildCount = function () {
    return (this.hasLeftChild() ? 1 : 0)
        + (this.hasRightChild() ? 1 : 0)
    ;
};

/**
 *  @returns {Number}
 */
TreeNode.prototype.getNonNilChildCount = function () {
    return (this.hasNonNilLeftChild() ? 1 : 0)
        + (this.hasNonNilRightChild() ? 1 : 0)
    ;
};

/**
 *  @returns {Number}
 */
TreeNode.prototype.getLevel = function () {
    var level = 0;
    for(
        var pCurrent = this._parent;
        pCurrent !== null;
        pCurrent = pCurrent._parent, ++level
    );

    return level;
};

/**
 *  @returns {Boolean}
 */
TreeNode.prototype.isLeaf = function () {
    return !this.hasLeftChild() && !this.hasRightChild();
};

/**
 *  @returns {Boolean}
 */
TreeNode.prototype.isNonNilLeaf = function () {
    return !this.hasNonNilLeftChild()
        && !this.hasNonNilRightChild()
    ;
};

/**
 *  @returns {Boolean}
 */
TreeNode.prototype.hasLeftChild = function () {
    return this._leftChild !== null;
};

/**
 *  @returns {Boolean}
 */
TreeNode.prototype.hasRightChild = function () {
    return this._rightChild !== null;
};

/**
 *  @returns {Boolean}
 */
TreeNode.prototype.hasNonNilLeftChild = function () {
    return this.hasLeftChild() && !this._leftChild.isNil();
};

/**
 *  @returns {Boolean}
 */
TreeNode.prototype.hasNonNilRightChild = function () {
    return this.hasRightChild() && !this._rightChild.isNil();
};

/**
 *  @returns {Function}
 */
TreeNode.prototype.getChildSlot = function () {
    var pChildSlot = null;

    if(this._parent !== null) {
        if(this._parent._leftChild === this) {
            pChildSlot = this._parent.leftChild;
        }
        else {
            pChildSlot = this._parent.rightChild;
        }
    }

    return pChildSlot;
};

/**
 *  @returns {Number}
 */
TreeNode.prototype.getChildSlotIndex = function () {
    return (
        (this._parent !== null)
        ? (this === this._parent._leftChild ? 0 : 1)
        : 2
    );
};

TreeNode.prototype.rotateLeft = function () {
    var pChildSlot = this.getChildSlot();

    var pParent = this._parent;
    var pLeftChildOfRightChild = this._rightChild._leftChild;

    this._rightChild._leftChild = this;
    this._parent = this._rightChild;

    this._rightChild._parent = pParent;
    if(pChildSlot !== null) {
        pChildSlot.call(pParent, this._rightChild);
    }

    this._rightChild = pLeftChildOfRightChild;
    if(pLeftChildOfRightChild !== TreeNode.nil) {
        pLeftChildOfRightChild._parent = this;
    }
};

TreeNode.prototype.rotateRight = function () {
    var pChildSlot = this.getChildSlot();

    var pParent = this._parent;
    var pRightChildOfLeftChild = this._leftChild._rightChild;

    this._leftChild._rightChild = this;
    this._parent = this._leftChild;

    this._leftChild._parent = pParent;
    if(pChildSlot !== null) {
        pChildSlot.call(pParent, this._leftChild);
    }

    this._leftChild = pRightChildOfLeftChild;
    if(pRightChildOfLeftChild !== TreeNode.nil) {
        pRightChildOfLeftChild._parent = this;
    }
};

/**
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.findLeftMostNode = function () {
    var pCurrent = this;
    for(
        ;
        pCurrent !== null && pCurrent.hasNonNilLeftChild();
        pCurrent = pCurrent._leftChild
    );

    return pCurrent;
};

/**
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.findRightMostNode = function () {
    var pCurrent = this;
    for(
        ;
        pCurrent !== null && pCurrent.hasNonNilRightChild();
        pCurrent = pCurrent._rightChild
    );

    return pCurrent;
};

/**
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.findLeftSubTreeRootNode = function () {
    var pCurrent = this;
    for(; pCurrent !== null; ) {
        var pParent = pCurrent._parent;
        if(pParent === null || pCurrent === pParent._leftChild) {
            break;
        }

        pCurrent = pParent;
    }

    return pCurrent;
};

/**
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.findRightSubTreeRootNode = function () {
    var pCurrent = this;
    for(; pCurrent !== null; ) {
        var pParent = pCurrent._parent;
        if(pParent === null || pCurrent === pParent._rightChild) {
            break;
        }

        pCurrent = pParent;
    }

    return pCurrent;
};

/**
 *  @param {Function} handler
 *  @param {Object} [thisArg]
 *  @returns {Boolean}
 */
TreeNode.prototype.traverseNonNilNodesByPostorder = function (handler) {
    var thisArg = arguments[1];

    var nodeStack = [];
    nodeStack.push(this);

    var pLastTraversedNode = null;
    var continueTraversal = true;
    for(; continueTraversal && nodeStack.length > 0; ) {
        var pCurrentNode = nodeStack[nodeStack.length - 1];
        if(
            !pCurrentNode.isLeaf()
            && pCurrentNode.getLastChild() !== pLastTraversedNode
        ) {
            if(pCurrentNode.hasRightChild()) {
                nodeStack.push(pCurrentNode._rightChild);
            }

            if(pCurrentNode.hasLeftChild()) {
                nodeStack.push(pCurrentNode._leftChild);
            }
        }
        else {
            if(!pCurrentNode.isNil()) {
                continueTraversal = !handler.call(thisArg, pCurrentNode);
            }
            pLastTraversedNode = pCurrentNode;
            nodeStack.pop();
        }
    }

    return continueTraversal;
};

/**
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.getGreater = function () {
    var pGreater = null;

    if(!this._rightChild.isNil()) {
        pGreater = this._rightChild.findLeftMostNode();
    }
    else {
        if(this._parent !== null) {
            if(this === this._parent._leftChild) {
                pGreater = this._parent;
            }
            else {
                pGreater = this.findLeftSubTreeRootNode()._parent;
            }
        }
    }

    return pGreater;
};

/**
 *  @returns {TreeNode<T>}
 */
TreeNode.prototype.getLess = function () {
    var less = null;

    if(this.hasNonNilLeftChild()) {
        less = this._leftChild.findRightMostNode();
    }
    else {
        var rstRoot = this.findRightSubTreeRootNode();
        if(rstRoot !== null) {
            less = rstRoot._parent;
        }
    }

    return less;
};

/**
 *  @template T
 *  @constructor
 *  @param {karbonator.comparartor} comparator
 *  @param {keyGetter} [keyGetter]
 */
function RbTreeSet(comparator) {
    detail._assertIsComparator(comparator);
    this._comparator = comparator;
    
    this._keyGetter = arguments[1];
    if(karbonator.isUndefined(this._keyGetter)) {
        this._keyGetter = RbTreeSet._defaultKeyGetter;
    }
    else if(!karbonator.isFunction(this._keyGetter)) {
        throw new TypeError("");
    }
    
    this._elementCount = 0;
    this._root = null;
    this._garbageNodes = [];
};

/**
 *  @callback keyGetter
 *  @param {Object} element
 *  @returns {Object}
 */
RbTreeSet._defaultKeyGetter = function (element) {
    return element;
};

/**
 *  @memberof karbonator.collection.RbTreeSet
 *  @readonly
 *  @enum {Number}
 */
RbTreeSet.SearchTarget = {
    less : 0,
    lessOrEqual : 1,
    greater : 2,
    greaterOrEqual : 3,
    equal : 4
};

/**
 *  @memberof karbonator.collection.RbTreeSet
 *  @constructor
 *  @function
 *  @param {karbonator.collection.RbTreeSet} tree
 *  @param {TreeNode<T>} node
 */
RbTreeSet.Iterator = function (tree, node) {
    this._tree = tree;
    this._node = node;
};

/**
 *  @function
 *  @param {karbonator.collection.RbTreeSet.Iterator} rhs
 *  @returns {Boolean}
 */
RbTreeSet.Iterator.prototype[karbonator.equals] = function (rhs) {
    return this._tree === rhs._tree
        && this._node === rhs._node
    ;
};

/**
 *  @function
 *  @returns {Boolean}
 */
RbTreeSet.Iterator.prototype.moveToNext = function () {
    var result = this._node !== null;
    if(result) {
        this._node = this._node.getGreater();
    }

    return result;
};

/**
 *  @function
 *  @returns {Boolean}
 */
RbTreeSet.Iterator.prototype.moveToPrevious = function () {
    var result = true;

    if(this._node === null) {
        this._node = this._tree._root.findRightMostNode();
    }
    else {
        var lesser = this._node.getLess();
        result = lesser !== null;
        if(result) {
            this._node = lesser;
        }
    }

    return result;
};

/**
 *  @function
 *  @returns {Object}
 */
RbTreeSet.Iterator.prototype.dereference = function () {
    if(this._node === null) {
        throw new Error("Cannot deference an iterator pointing the end of container.");
    }

    return this._node._element;
};

/**
 *  @function
 *  @returns {karbonator.collection.RbTreeSet.Iterator}
 */
RbTreeSet.prototype.begin = function () {
    return new RbTreeSet.Iterator(
        this,
        (this._root !== null ? this._root.findLeftMostNode() : null)
    );
};

/**
 *  @function
 *  @returns {karbonator.collection.RbTreeSet.Iterator}
 */
RbTreeSet.prototype.end = function () {
    return new RbTreeSet.Iterator(this, null);
};

/**
 *  @function
 *  @returns {Number}
 */
RbTreeSet.prototype.getElementCount = function () {
    return this._elementCount;
};

/**
 *  @function
 *  @returns {Boolean}
 */
RbTreeSet.prototype.isEmpty = function () {
    return this._root === null;
};

/**
 *  @function
 *  @param {Object} element
 *  @param {Number} searchTarget
 *  @returns {karbonator.collection.RbTreeSet.Iterator}
 */
RbTreeSet.prototype.find = function (element, searchTarget) {
    return new RbTreeSet.Iterator(this, this._findNode(element, searchTarget));
};

/**
 *  @function
 *  @param {Object} element
 *  @returns {karbonator.collection.RbTreeSet.Iterator}
 */
RbTreeSet.prototype.insert = function (element) {
    var insertedNode = this._insertNodeInBst(element);
    if(insertedNode !== null) {
        ++this._elementCount;
        this._rebalanceAfterInsertion(insertedNode);
    }

    return new RbTreeSet.Iterator(this, insertedNode);
};

/**
 *  @function
 *  @param {Object} element
 *  @returns {Boolean}
 */
RbTreeSet.prototype.remove = function (element) {
    var pTarget = this._findNode(element, RbTreeSet.SearchTarget.equal);
    var targetFound = pTarget !== null;
    if(targetFound) {
        --this._elementCount;

        var info = this._disconnectNodeFromBst(pTarget);

        var pTempNilNode = null;
        if(info.pReplacement === TreeNode.nil) {
            pTempNilNode = this._constructNode(info.pParentOfReplacement, null);
            pTempNilNode._red = false;
            if(info.pParentOfReplacement !== null) {
                info.pReplacementChildSlot.call(info.pParentOfReplacement, pTempNilNode);
            }
            info.pReplacement = pTempNilNode;
        }

        if(info.pRemovalTarget._red) {
            info.pRemovalTarget._red = false;
            info.pReplacement._red = true;
        }
        else {
            this._rebalanceAfterRemoval(info.pReplacement, info.pParentOfReplacement);
            if(this._root === pTempNilNode) {
                this._root = null;
            }
            else if(info.pReplacement.isNonNilRoot()) {
                this._root = info.pReplacement;
            }
            else if(!this._root.isNonNilRoot()) {
                this._root = this._root.getRoot();
            }
        }

        info.pRemovalTarget._parent = null;
        this._destructNode(info.pRemovalTarget);
        if(pTempNilNode !== null) {
            pTempNilNode._parent = null;
            this._destructNode(pTempNilNode);
            if(info.pParentOfReplacement !== null) {
                info.pReplacementChildSlot.call(info.pParentOfReplacement, TreeNode.nil);
            }
        }
    }

    return targetFound;
};

/**
 *  @function
 */
RbTreeSet.prototype.removeAll = function () {
    if(!this.isEmpty()) {
        this._root.traverseNonNilNodesByPostorder(
            RbTreeSet._traversalHandlerOfRemoveAll,
            this
        );

        this._root = null;
        this._elementCount = 0;
    }
};

/**
 *  @function
 *  @returns {String}
 */
RbTreeSet.prototype.toString = function () {
    var str = detail._colStrBegin;
    
    var iter = this.begin();
    var endIter = this.end();
    if(!iter[karbonator.equals](endIter)) {
        str += iter.dereference();
        iter.moveToNext();
    }
    
    for(; !iter[karbonator.equals](endIter); iter.moveToNext()) {
        str += _colStrSeparator;
        str += iter.dereference();
    }
    
    str += detail._colStrEnd;
    
    return str;
};

/**
 *  @memberof karbonator.collection.RbTreeSet
 *  @private
 *  @function
 *  @param {TreeNode<T>} node
 */
RbTreeSet._traversalHandlerOfRemoveAll = function (node) {
    this._destructNode(node);
};

/**
 *  @private
 *  @function
 *  @param {TreeNode<T>} parent
 *  @param {Object} element
 *  @returns {TreeNode<T>}
 */
RbTreeSet.prototype._constructNode = function (parent, element) {
    var node = null;
    if(this._garbageNodes.length < 1) {
        node = new TreeNode(parent, TreeNode.nil, TreeNode.nil, element, true);
    }
    else {
        node = this._garbageNodes.pop();
        TreeNode.call(node, parent, TreeNode.nil, TreeNode.nil, element, true);
    }

    return node;
};

/**
 *  @private
 *  @function
 *  @param {TreeNode<T>} node
 *  @param {Boolean} [pushToGarbageList=true]
 */
RbTreeSet.prototype._destructNode = function (node) {
    node._element =
    node._parent =
    node._leftChild =
    node._rightChild =
    node._red = undefined;

    if(typeof(arguments[2]) === "undefined" || !!arguments[2]) {
        this._garbageNodes.push(node);
    }
};

/**
 *  @private
 *  @function
 *  @param {Object} element
 *  @param {Number} searchTarget
 *  @returns {TreeNode<T>}
 */
RbTreeSet.prototype._findNode = function (element, searchTarget) {
    var pElementKey = this._keyGetter(element);
    var pCurrent = this._root, pPrevious = null;
    for(; pCurrent !== null && !pCurrent.isNil(); ) {
        var pCurrentElementKey = this._keyGetter(pCurrent._element);
        var compResult = this._comparator(pElementKey, pCurrentElementKey);
        if(compResult < 0) {
            pPrevious = pCurrent;
            pCurrent = pCurrent._leftChild;
        }
        else if(compResult > 0) {
            pPrevious = pCurrent;
            pCurrent = pCurrent._rightChild;
        }
        else {
            break;
        }
    }

    switch(searchTarget) {
    case RbTreeSet.SearchTarget.less:
        if(null === pCurrent || pCurrent.isNil()) {
            pCurrent = pPrevious;
        }

        while(
            null !== pCurrent && !pCurrent.isNil()
            && this._comparator(this._keyGetter(pCurrent._element), pElementKey) >= 0
        ) {
            pCurrent = pCurrent.getLess();
        }
    break;
    case RbTreeSet.SearchTarget.lessOrEqual:
        if(null !== pCurrent && !pCurrent.isNil()) {
            return pCurrent;
        }
        else {
            if(null === pCurrent || pCurrent.isNil()) {
                pCurrent = pPrevious;
            }

            while(
                null !== pCurrent && !pCurrent.isNil()
                && this._comparator(this._keyGetter(pCurrent._element), pElementKey) >= 0
            ) {
                pCurrent = pCurrent.getLess();
            }
        }
    break;
    case RbTreeSet.SearchTarget.greater:
        if(null === pCurrent || pCurrent.isNil()) {
            pCurrent = pPrevious;
        }

        while(
            null !== pCurrent && !pCurrent.isNil()
            && this._comparator(pElementKey, this._keyGetter(pCurrent._element)) >= 0
        ) {
            pCurrent = pCurrent.getGreater();
        }
    break;
    case RbTreeSet.SearchTarget.greaterOrEqual:
        if(null !== pCurrent && !pCurrent.isNil()) {
            return pCurrent;
        }
        else {
            if(null === pCurrent || pCurrent.isNil()) {
                pCurrent = pPrevious;
            }

            while(
                null !== pCurrent && !pCurrent.isNil()
                && this._comparator(pElementKey, this._keyGetter(pCurrent._element)) >= 0
            ) {
                pCurrent = pCurrent.getGreater();
            }
        }
    break;
    case RbTreeSet.SearchTarget.equal:
    break;
    default:
        throw new Error("An unknown search target has been detected.");
    }

    return (pCurrent !== null && !pCurrent.isNil() ? pCurrent : null);

//        var pFoundNode = null;
//        if(
//            searchTarget >= RbTreeSet.SearchTarget.greater
//            && pPrevious !== null
//            && !pPrevious.isNil()
//            && this._comparator(this._keyGetter(pPrevious._element), pElementKey) < 0
//        ) {
//            pPrevious = pPrevious.getGreater();
//        }
//        switch(searchTarget) {
//        case RbTreeSet.SearchTarget.equal:
//            pFoundNode = (pCurrent !== null && !pCurrent.isNil() ? pCurrent : null);
//        break;
//        case RbTreeSet.SearchTarget.greater:
//            pFoundNode = (pPrevious !== null && !pPrevious.isNil() ? pPrevious : null);
//        break;
//        case RbTreeSet.SearchTarget.greaterOrEqual:
//            pFoundNode = (pCurrent !== null && !pCurrent.isNil() ? pCurrent : pPrevious);
//        break;
//        default:
//            throw new Error("An unknown search target has been detected.");
//        }
//
//        return pFoundNode;
};

/**
 *  @private
 *  @function
 *  @param {Object} element
 *  @returns {TreeNode<T>}
 */
RbTreeSet.prototype._insertNodeInBst = function (element) {
    var newNode = null;

    if(this._root === null) {
        newNode = this._constructNode(null, element);
        this._root = newNode;
    }
    else {
        var pElementKey = this._keyGetter(element);
        for(
            var pCurrent = this._root;
            !pCurrent.isNil();
        ) {
            var pCurrentElementKey = this._keyGetter(pCurrent._element);
            var compResult = this._comparator(pElementKey, pCurrentElementKey);
            if(compResult < 0) {
                if(pCurrent._leftChild === TreeNode.nil) {
                    newNode = this._constructNode(pCurrent, element);
                    pCurrent._leftChild = newNode;

                    pCurrent = TreeNode.nil;
                }
                else {
                    pCurrent = pCurrent._leftChild;
                }
            }
            else if(compResult > 0) {
                if(pCurrent._rightChild === TreeNode.nil) {
                    newNode = this._constructNode(pCurrent, element);
                    pCurrent._rightChild = newNode;

                    pCurrent = TreeNode.nil;
                }
                else {
                    pCurrent = pCurrent._rightChild;
                }
            }
            else {
                pCurrent = TreeNode.nil;
            }
        }
    }

    return newNode;
};

/**
 *  @private
 *  @function
 *  @param {TreeNode<T>} target
 *  @returns {Object}
 */
RbTreeSet.prototype._disconnectNodeFromBst = function (target) {
    var out = {
        pRemovalTarget : null,
        pReplacement : null,
        pParentOfReplacement : null,
        pReplacementChildSlot : null
    };

    out.pRemovalTarget = target;
    var childCount = target.getNonNilChildCount();
    if(childCount >= 2) {
        var pMaximumOfRightSubTree = target._leftChild.findRightMostNode();
        if(pMaximumOfRightSubTree === null) {
            throw new Error();
        }

        out.pRemovalTarget = pMaximumOfRightSubTree;

        //this._destructElement(target._element);
        target._element = pMaximumOfRightSubTree._element;
        pMaximumOfRightSubTree._element = null;
    }

    var pSelectedChildSlot = (
        out.pRemovalTarget.hasNonNilLeftChild()
        ? out.pRemovalTarget.leftChild
        : out.pRemovalTarget.rightChild
    );
    out.pReplacement = pSelectedChildSlot.call(out.pRemovalTarget);

    var pTargetParent = out.pRemovalTarget._parent;
    out.pParentOfReplacement = pTargetParent;
    if(pTargetParent !== null) {
        if(pTargetParent._leftChild === out.pRemovalTarget) {
            pTargetParent._leftChild = pSelectedChildSlot.call(out.pRemovalTarget);
            out.pReplacementChildSlot = pTargetParent.leftChild;
        }
        else {
            pTargetParent._rightChild = pSelectedChildSlot.call(out.pRemovalTarget);
            out.pReplacementChildSlot = pTargetParent.rightChild;
        }
    }
    else {
        out.pReplacementChildSlot = null;
    }
    if(!pSelectedChildSlot.call(out.pRemovalTarget).isNil()) {
        pSelectedChildSlot.call(out.pRemovalTarget)._parent = pTargetParent;
    }

    return out;
};

/**
 *  @private
 *  @function
 *  @param {TreeNode<T>} insertedNode
 */
RbTreeSet.prototype._rebalanceAfterInsertion = function (insertedNode) {
    if(insertedNode.isNonNilRoot()) {
        insertedNode._red = false;
    }
    else for(
        var pCurrent = insertedNode;
        pCurrent !== null;
    ) {
        var pParent = pCurrent._parent;
        if(pParent._red) {
            var pUncle = pParent.getSibling();
            if(pUncle !== TreeNode.nil && pUncle._red) {
                pParent._red = false;
                pUncle._red = false;

                var pGrandParent = pParent._parent;
                if(!pGrandParent.isNonNilRoot()) {
                    pGrandParent._red = true;
                    pCurrent = pGrandParent;
                }
                else {
                    pCurrent = null;
                }
            }
            else {
                var pGrandParent = pParent._parent;
                var pTarget = pCurrent;
                if(
                    pTarget === pParent._rightChild
                    && pParent === pGrandParent._leftChild
                ) {
                    pParent.rotateLeft();
                    pTarget = pTarget._leftChild;
                }
                else if(
                    pTarget === pParent._leftChild
                    && pParent === pGrandParent._rightChild
                ) {
                    pParent.rotateRight();
                    pTarget = pTarget._rightChild;
                }

                var pGrandParentOfTarget = pTarget.getGrandParent();
                pTarget._parent._red = false;
                pGrandParentOfTarget._red = true;
                var isGrandParentRoot = pGrandParentOfTarget.isNonNilRoot();
                if(pTarget === pTarget._parent._leftChild) {
                    pGrandParentOfTarget.rotateRight();
                }
                else {
                    pGrandParentOfTarget.rotateLeft();
                }
                if(isGrandParentRoot) {
                    this._root = pGrandParentOfTarget._parent;
                }

                pCurrent = null;
            }
        }
        else {
            pCurrent = null;
        }
    }
};

/**
 *  @private
 *  @function
 *  @param {TreeNode<T>} replacement
 *  @param {TreeNode<T>} pParentOfReplacement
 */
RbTreeSet.prototype._rebalanceAfterRemoval = function (replacement, pParentOfReplacement) {
    if(replacement._red) {
        replacement._red = false;
    }
    else for(
        var pCurrent = replacement, pParentOfCurrent = pParentOfReplacement;
        pCurrent !== null;
    ) {
        if(pParentOfCurrent === null) {
            this._root = pCurrent;

            pCurrent = null;
        }
        else {
            var pSiblingOfCurrent = pCurrent.getSibling();
            if(pSiblingOfCurrent._red) {
                pParentOfCurrent._red = true;
                pSiblingOfCurrent._red = false;

                if(pSiblingOfCurrent === pParentOfCurrent._rightChild) {
                    pParentOfCurrent.rotateLeft();
                }
                else {
                    pParentOfCurrent.rotateRight();
                }
            }

            pSiblingOfCurrent = pCurrent.getSibling();
            if(
                !pParentOfCurrent._red
                && !pSiblingOfCurrent._red
                && !pSiblingOfCurrent._leftChild._red
                && !pSiblingOfCurrent._rightChild._red
            ) {
                pSiblingOfCurrent._red = true;

                pCurrent = pParentOfCurrent;
                pParentOfCurrent = pCurrent._parent;
            }
            else {
                if(
                    pParentOfCurrent._red
                    && !pSiblingOfCurrent._red
                    && !pSiblingOfCurrent._leftChild._red
                    && !pSiblingOfCurrent._rightChild._red
                ) {
                    pParentOfCurrent._red = false;
                    pSiblingOfCurrent._red = true;
                }
                else if(!pSiblingOfCurrent._red) {
                    if(
                        pCurrent === pParentOfCurrent._leftChild
                        && pSiblingOfCurrent._leftChild._red
                        && !pSiblingOfCurrent._rightChild._red
                    ) {
                        pSiblingOfCurrent._red = true;
                        pSiblingOfCurrent._leftChild._red = false;

                        pSiblingOfCurrent.rotateRight();
                    }
                    else if(
                        pCurrent === pParentOfCurrent._rightChild
                        && pSiblingOfCurrent._rightChild._red
                        && !pSiblingOfCurrent._leftChild._red
                    ) {
                        pSiblingOfCurrent._red = true;
                        pSiblingOfCurrent._rightChild._red = false;

                        pSiblingOfCurrent.rotateLeft();
                    }
                }

                pSiblingOfCurrent = pCurrent.getSibling();
                if(!pSiblingOfCurrent._red) {
                    var isParentRed = pParentOfCurrent._red;
                    pParentOfCurrent._red = pSiblingOfCurrent._red;
                    pSiblingOfCurrent._red = isParentRed;

                    if(
                        pCurrent === pParentOfCurrent._leftChild
                        && pSiblingOfCurrent._rightChild._red
                    ) {
                        pSiblingOfCurrent._rightChild._red = false;
                        pParentOfCurrent.rotateLeft();
                    }
                    else if(
                        pCurrent === pParentOfCurrent._rightChild
                        && pSiblingOfCurrent._leftChild._red
                    ) {
                        pSiblingOfCurrent._leftChild._red = false;
                        pParentOfCurrent.rotateRight();
                    }
                }

                pCurrent = null;
            }
        }
    }
};
