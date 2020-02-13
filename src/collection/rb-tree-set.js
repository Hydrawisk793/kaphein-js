var isUndefined = require("../utils/type-trait").isUndefined;
var isIterable = require("../utils/type-trait").isIterable;
var isFunction = require("../utils/type-trait").isFunction;
var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;

var RbTreeSet = (function ()
{
    var _isSymbolSupported = isSymbolSupported();

    /**
     *  @template T
     *  @constructor
     *  @param {T} element
     *  @param {boolean} [red]
     *  @param {RbTreeNode<T>} [parent]
     *  @param {RbTreeNode<T>} [leftChild]
     *  @param {RbTreeNode<T>} [rightChild]
     */
    function RbTreeNode(element)
    {
        var red = arguments[1];
        var parent = arguments[2];
        var leftChild = arguments[3];
        var rightChild = arguments[4];

        /** @type {RbTreeNode<T>} */this._parent = isUndefined(parent) ? null : parent;
        /** @type {RbTreeNode<T>} */this._leftChild = isUndefined(leftChild) ? null : leftChild;
        /** @type {RbTreeNode<T>} */this._rightChild = isUndefined(rightChild) ? null : rightChild;
        /** @type {T} */this._element = element;
        this._red = !!red;
    }

    RbTreeNode.prototype = {
        constructor : RbTreeNode,

        leftChild()
        {
            if(arguments.length < 1) {
                return this._leftChild;
            }
            else {
                this._leftChild = arguments[0];
            }
        },

        rightChild()
        {
            if(arguments.length < 1) {
                return this._rightChild;
            }
            else {
                this._rightChild = arguments[0];
            }
        },

        getRoot()
        {
            var pRoot = this;
            for(
                var pParent = pRoot._parent;
                pParent !== null;
                pRoot = pParent, pParent = pRoot._parent
            );

            return pRoot;
        },

        getGrandParent()
        {
            return (this._parent !== null ? this._parent._parent : null);
        },

        getUncle()
        {
            var pUncle = null;

            var pGrandParent = this.getGrandParent();
            if(pGrandParent !== null) {
                pUncle = (pGrandParent._leftChild === this._parent
                    ? pGrandParent._rightChild
                    : pGrandParent._leftChild
                );
            }

            return pUncle;
        },

        /**
         *  @param {*} parent
         */
        getSibling(parent)
        {
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
        },

        isNil()
        {
            return this._element === null;
        },

        isNonNilRoot()
        {
            return this._parent === null && !this.isNil();
        },

        /**
         *  @param {number} index
         */
        getChild(index)
        {
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
        },

        getLastChild()
        {
            return (this.hasRightChild() ? this._rightChild : this._leftChild);
        },

        /**
         *  @param {number} index
         *  @param {*} node
         */
        setChild(index, node)
        {
            var detachedChild = null;

            switch(index) {
            case 0:
                if(this.hasNonNilLeftChild()) {
                    detachedChild = this._leftChild;
                    this._leftChild._parent = null;
                }
                this._leftChild = node;
            break;
            case 1:
                if(this.hasNonNilRightChild()) {
                    detachedChild = this._rightChild;
                    this._rightChild._parent = null;
                }
                this._rightChild = node;
            break;
            default:
                throw new Error("The range of the index must be [0, 1].");
            }

            if(node) {
                if(node._parent !== null) {
                    node.getChildSlot().call(node._parent, null);
                }
                node._parent = this;
            }

            return detachedChild;
        },

        getChildCount()
        {
            return (this.hasLeftChild() ? 1 : 0)
                + (this.hasRightChild() ? 1 : 0)
            ;
        },

        getNonNilChildCount()
        {
            return (this.hasNonNilLeftChild() ? 1 : 0)
                + (this.hasNonNilRightChild() ? 1 : 0)
            ;
        },

        getLevel()
        {
            var level = 0;
            for(
                var current = this._parent;
                null !== current;
                current = current._parent, ++level
            );

            return level;
        },

        isLeaf()
        {
            return !this.hasLeftChild() && !this.hasRightChild();
        },

        isNonNilLeaf()
        {
            return !this.hasNonNilLeftChild()
                && !this.hasNonNilRightChild()
            ;
        },

        hasLeftChild()
        {
            return null !== this._leftChild;
        },

        hasRightChild()
        {
            return null !== this._rightChild;
        },

        hasNonNilLeftChild()
        {
            return this.hasLeftChild() && !this._leftChild.isNil();
        },

        hasNonNilRightChild()
        {
            return this.hasRightChild() && !this._rightChild.isNil();
        },

        getChildSlot()
        {
            return (
                null !== this._parent
                ? (
                    this === this._parent._leftChild
                    ? this._parent.leftChild
                    : this._parent.rightChild
                )
                : null
            );
        },

        getChildSlotIndex()
        {
            return (
                (this._parent !== null)
                ? (this === this._parent._leftChild ? 0 : 1)
                : 2
            );
        },

        rotateLeft()
        {
            var pChildSlot = this.getChildSlot();

            var parent = this._parent;
            var leftChildOfRightChild = this._rightChild._leftChild;

            this._rightChild._leftChild = this;
            this._parent = this._rightChild;

            this._rightChild._parent = parent;
            if(pChildSlot !== null) {
                pChildSlot.call(parent, this._rightChild);
            }

            this._rightChild = leftChildOfRightChild;
            if(leftChildOfRightChild !== RbTreeNode.nil) {
                leftChildOfRightChild._parent = this;
            }
        },

        rotateRight()
        {
            var pChildSlot = this.getChildSlot();

            var pParent = this._parent;
            var rightChildOfLeftChild = this._leftChild._rightChild;

            this._leftChild._rightChild = this;
            this._parent = this._leftChild;

            this._leftChild._parent = pParent;
            if(pChildSlot !== null) {
                pChildSlot.call(pParent, this._leftChild);
            }

            this._leftChild = rightChildOfLeftChild;
            if(rightChildOfLeftChild !== RbTreeNode.nil) {
                rightChildOfLeftChild._parent = this;
            }
        },

        findLeftMostNode()
        {
            var pCurrent = this;
            for(
                ;
                pCurrent !== null && pCurrent.hasNonNilLeftChild();
                pCurrent = pCurrent._leftChild
            );

            return pCurrent;
        },

        findRightMostNode()
        {
            var pCurrent = this;
            for(
                ;
                pCurrent !== null && pCurrent.hasNonNilRightChild();
                pCurrent = pCurrent._rightChild
            );

            return pCurrent;
        },

        findLeftSubTreeRootNode()
        {
            var pCurrent = this;
            for(; pCurrent !== null; ) {
                var pParent = pCurrent._parent;
                if(pParent === null || pCurrent === pParent._leftChild) {
                    break;
                }

                pCurrent = pParent;
            }

            return pCurrent;
        },

        findRightSubTreeRootNode()
        {
            var pCurrent = this;
            for(; pCurrent !== null; ) {
                var pParent = pCurrent._parent;
                if(pParent === null || pCurrent === pParent._rightChild) {
                    break;
                }

                pCurrent = pParent;
            }

            return pCurrent;
        },

        /**
         *  @param {Function} handler
         *  @param {*} [thisArg]
         */
        traverseNonNilNodesByPostorder(handler)
        {
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
        },

        getGreater()
        {
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
        },

        getLess()
        {
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
        },
    };

    /**
     *  @template T
     *  @readonly
     */
    RbTreeNode.nil = new RbTreeNode(/** @type {T} */(null), false, null, null, null);

    /**
     *  @template T
     *  @constructor
     *  @param {RbTreeSet<T>} tree
     *  @param {RbTreeNode<T>} node
     */
    function CppValueIterator(tree, node)
    {
        this._tree = tree;
        this._node = node;
    }

    CppValueIterator.prototype = {
        constructor : CppValueIterator,

        equals(other)
        {
            var result = this === other;

            if(!result) {
                result = other instanceof CppValueIterator
                    && this._node === other._node
                ;
            }

            return result;
        },

        isNull()
        {
            return null === this._node;
        },

        dereference()
        {
            if(null === this._node) {
                throw new Error("Cannot deference an iterator pointing the end of container.");
            }

            return this._node._element;
        },

        moveToNext()
        {
            var result = null !== this._node;
            if(result) {
                this._node = this._node.getGreater();
            }

            return result;
        },

        moveToPrevious()
        {
            var result = true;

            if(null === this._node) {
                this._node = this._tree._root.findRightMostNode();
            }
            else {
                var lesser = this._node.getLess();
                result = null !== lesser;
                if(result) {
                    this._node = lesser;
                }
            }

            return result;
        },
    };

    /**
     *  @template T
     *  @typedef {import ("./comparer").Comparer<T>} Comparer
     */

    /**
     *  @template T
     *  @param {T} lhs
     *  @param {T} rhs
     */
    function _defaultComparer(lhs, rhs)
    {
        return (lhs === rhs ? 0 : 1);
    }

    /**
     *  @readonly
     *  @enum {number}
     */
    var SearchTarget = {
        less : 0,
        lessOrEqual : 1,
        greater : 2,
        greaterOrEqual : 3,
        equal : 4,
    };

    /**
     *  @template T
     *  @constructor
     *  @param {Iterable<T>} [iterable]
     *  @param {Comparer<T>} [comparer]
     */
    function RbTreeSet()
    {
        var iterable = arguments[0];
        var comparer = arguments[1];

        /** @type {Comparer<T>} */this._comparer = isFunction(comparer) ? comparer : _defaultComparer;
        this.size = 0;
        /** @type {RbTreeNode<T>} */this._root = null;
        /** @type {RbTreeNode<T>[]} */this._garbageNodes = [];

        if(isIterable(iterable)) {
            var entriesFuncKey = (_isSymbolSupported ? Symbol.iterator : "entries");
            for(var i = iterable[entriesFuncKey](), iP = i.next(); !iP.done; iP = i.next()) {
                this.add(iP.value);
            }
        }
    }

    RbTreeSet.SearchTarget = SearchTarget;

    RbTreeSet.prototype = {
        constructor : RbTreeSet,

        size : 0,

        getElementCount()
        {
            return this.size;
        },

        isEmpty()
        {
            return null === this._root;
        },

        /**
         *  @param {Function} callback
         *  @param {*} [thisArg] 
         */
        forEach(callback)
        {
            if(!isFunction(callback)) {
                throw new TypeError("'callback' must be a function.");
            }

            var thisArg = arguments[1];

            var endIter = this.end();
            for(var iter = this.begin(); !endIter.equals(iter); iter.moveToNext()) {
                var element = iter.dereference();
                callback.call(thisArg, element, element, this);
            }
        },

        /**
         *  @returns {CppValueIterator<T>} 
         */
        begin()
        {
            return new CppValueIterator(
                this,
                (null !== this._root ? this._root.findLeftMostNode() : null)
            );
        },

        /**
         *  @returns {CppValueIterator<T>} 
         */
        end()
        {
            return new CppValueIterator(this, null);
        },

        entries()
        {
            return new PairIterator(this);
        },

        keys()
        {
            return new ValueIterator(this);
        },

        values()
        {
            return new ValueIterator(this);
        },

        /**
         *  @param {T} element
         *  @param {SearchTarget} searchTarget
         *  @returns {CppValueIterator<T>}
         */
        find(element, searchTarget)
        {
            return new CppValueIterator(this, RbTreeSet_findNode(this, element, searchTarget));
        },

        /**
         *  @param {T} value
         */
        has(value)
        {
            return !this.find(value, SearchTarget.equal).isNull();
        },

        /**
         *  @param {T} element
         *  @returns {CppValueIterator<T>}
         */
        add(element)
        {
            var insertedNode = RbTreeSet_insertNodeInBst(this, element);
            if(null !== insertedNode) {
                ++this.size;

                RbTreeSet_rebalanceAfterInsertion(this, insertedNode);
            }

            return new CppValueIterator(this, insertedNode);
        },

        /**
         *  @param {T} element
         */
        "delete"(element)
        {
            var targetNode = RbTreeSet_findNode(this, element, SearchTarget.equal);
            var targetFound = targetNode !== null;
            if(targetFound) {
                --this.size;

                var info = RbTreeSet_disconnectNodeFromBst(this, targetNode);

                var pTempNilNode = null;
                if(info.pReplacement === RbTreeNode.nil) {
                    pTempNilNode = RbTreeSet_constructNode(this, info.pParentOfReplacement, null);
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
                    RbTreeSet_rebalanceAfterRemoval(this, info.pReplacement, info.pParentOfReplacement);

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
                RbTreeSet_destructNode(this, info.pRemovalTarget);
                if(pTempNilNode !== null) {
                    pTempNilNode._parent = null;
                    RbTreeSet_destructNode(this, pTempNilNode);
                    if(info.pParentOfReplacement !== null) {
                        info.pReplacementChildSlot.call(info.pParentOfReplacement, RbTreeNode.nil);
                    }
                }
            }

            return targetFound;
        },

        clear()
        {
            if(!this.isEmpty()) {
                this._root.traverseNonNilNodesByPostorder(
                    RbTreeSet_traversalHandlerOfRemoveAll,
                    this
                );

                this._root = null;
                this.size = 0;
            }
        },

        toString()
        {
            var str = '[';

            var iter = this.begin();
            var endIter = this.end();
            if(!endIter.equals(iter)) {
                str += iter.dereference();
                iter.moveToNext();
            }

            for(; !endIter.equals(iter); iter.moveToNext()) {
                str += ',';
                str += iter.dereference();
            }

            str += ']';

            return str;
        },
    };

    /**
     *  @template T
     *  @param {RbTreeSet<T>} thisRef
     *  @param {RbTreeNode<T>} parent
     *  @param {T} element
     */
    function RbTreeSet_constructNode(thisRef, parent, element)
    {
        /** @type {RbTreeNode<T>} */var node = null;
        if(thisRef._garbageNodes.length < 1) {
            node = new RbTreeNode(element, true, parent, RbTreeNode.nil, RbTreeNode.nil);
        }
        else {
            node = thisRef._garbageNodes.pop();
            RbTreeNode.call(node, element, true, parent, RbTreeNode.nil, RbTreeNode.nil);
        }

        return node;
    }

    /**
     *  @template T
     *  @param {RbTreeSet<T>} thisRef
     *  @param {RbTreeNode<T>} node
     *  @param {boolean} [pushToGarbageList]
     */
    function RbTreeSet_destructNode(thisRef, node)
    {
        node._element = null;
        node._parent = null;
        node._leftChild = null;
        node._rightChild = null;
        node._red = false;

        var pushToGarbageList = arguments[2];
        if("undefined" === typeof pushToGarbageList || !!pushToGarbageList) {
            thisRef._garbageNodes.push(node);
        }
    }

    /**
     *  @template T
     *  @param {RbTreeSet<T>} thisRef
     *  @param {T} element
     *  @param {SearchTarget} searchTarget
     */
    function RbTreeSet_findNode(thisRef, element, searchTarget)
    {
        var currentNode = thisRef._root, prevNode = null;
        for(; currentNode !== null && !currentNode.isNil(); ) {
            var currentElement = currentNode._element;
            var compResult = thisRef._comparer(element, currentElement);
            if(compResult < 0) {
                prevNode = currentNode;
                currentNode = currentNode._leftChild;
            }
            else if(compResult > 0) {
                prevNode = currentNode;
                currentNode = currentNode._rightChild;
            }
            else {
                break;
            }
        }

        switch(searchTarget) {
        case SearchTarget.less:
            if(null === currentNode || currentNode.isNil()) {
                currentNode = prevNode;
            }

            while(
                null !== currentNode && !currentNode.isNil()
                && thisRef._comparer(currentNode._element, element) >= 0
            ) {
                currentNode = currentNode.getLess();
            }
        break;
        case SearchTarget.lessOrEqual:
            if(null !== currentNode && !currentNode.isNil()) {
                return currentNode;
            }
            else {
                if(null === currentNode || currentNode.isNil()) {
                    currentNode = prevNode;
                }

                while(
                    null !== currentNode && !currentNode.isNil()
                    && thisRef._comparer(currentNode._element, element) >= 0
                ) {
                    currentNode = currentNode.getLess();
                }
            }
        break;
        case SearchTarget.greater:
            if(null === currentNode || currentNode.isNil()) {
                currentNode = prevNode;
            }

            while(
                null !== currentNode && !currentNode.isNil()
                && thisRef._comparer(element, currentNode._element) >= 0
            ) {
                currentNode = currentNode.getGreater();
            }
        break;
        case SearchTarget.greaterOrEqual:
            if(null !== currentNode && !currentNode.isNil()) {
                return currentNode;
            }
            else {
                if(null === currentNode || currentNode.isNil()) {
                    currentNode = prevNode;
                }

                while(
                    null !== currentNode && !currentNode.isNil()
                    && thisRef._comparer(element, currentNode._element) >= 0
                ) {
                    currentNode = currentNode.getGreater();
                }
            }
        break;
        case SearchTarget.equal:
        break;
        default:
            throw new Error("An unknown search target has been detected.");
        }

        return (currentNode !== null && !currentNode.isNil() ? currentNode : null);
    }

    /**
     *  @template T
     *  @param {RbTreeSet<T>} thisRef
     *  @param {T} element
     */
    function RbTreeSet_insertNodeInBst(thisRef, element)
    {
        var newNode = null;

        if(thisRef._root === null) {
            newNode = RbTreeSet_constructNode(thisRef, null, element);
            thisRef._root = newNode;
        }
        else {
            for(var currentNode = thisRef._root; !currentNode.isNil(); ) {
                var currentElement = currentNode._element;
                var compResult = thisRef._comparer(element, currentElement);
                if(compResult < 0) {
                    if(currentNode._leftChild === RbTreeNode.nil) {
                        newNode = RbTreeSet_constructNode(thisRef, currentNode, element);
                        currentNode._leftChild = newNode;

                        currentNode = RbTreeNode.nil;
                    }
                    else {
                        currentNode = currentNode._leftChild;
                    }
                }
                else if(compResult > 0) {
                    if(currentNode._rightChild === RbTreeNode.nil) {
                        newNode = RbTreeSet_constructNode(thisRef, currentNode, element);
                        currentNode._rightChild = newNode;

                        currentNode = RbTreeNode.nil;
                    }
                    else {
                        currentNode = currentNode._rightChild;
                    }
                }
                else {
                    currentNode = RbTreeNode.nil;
                }
            }
        }

        return newNode;
    }

    /**
     *  @template T
     *  @param {RbTreeSet<T>} thisRef
     *  @param {RbTreeNode<T>} target
     */
    function RbTreeSet_disconnectNodeFromBst(thisRef, target)
    {
        var out = {
            /** @type {RbTreeNode<T>} */pRemovalTarget : null,
            /** @type {RbTreeNode<T>} */pReplacement : null,
            /** @type {RbTreeNode<T>} */pParentOfReplacement : null,
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

            //thisRef._destructElement(target._element);
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
    }

    /**
     *  @template T
     *  @param {RbTreeSet<T>} thisRef
     *  @param {RbTreeNode<T>} insertedNode
     */
    function RbTreeSet_rebalanceAfterInsertion(thisRef, insertedNode)
    {
        if(insertedNode.isNonNilRoot()) {
            insertedNode._red = false;
        }
        else for(var pCurrent = insertedNode; pCurrent !== null; ) {
            var pGrandParent;
            var pTarget;
            var pGrandParentOfTarget;
            var isGrandParentRoot;

            var pParent = pCurrent._parent;
            if(pParent._red) {
                var pUncle = pParent.getSibling();
                if(pUncle !== RbTreeNode.nil && pUncle._red) {
                    pParent._red = false;
                    pUncle._red = false;

                    pGrandParent = pParent._parent;
                    if(!pGrandParent.isNonNilRoot()) {
                        pGrandParent._red = true;
                        pCurrent = pGrandParent;
                    }
                    else {
                        pCurrent = null;
                    }
                }
                else {
                    pGrandParent = pParent._parent;
                    pTarget = pCurrent;
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

                    pGrandParentOfTarget = pTarget.getGrandParent();
                    pTarget._parent._red = false;
                    pGrandParentOfTarget._red = true;
                    isGrandParentRoot = pGrandParentOfTarget.isNonNilRoot();
                    if(pTarget === pTarget._parent._leftChild) {
                        pGrandParentOfTarget.rotateRight();
                    }
                    else {
                        pGrandParentOfTarget.rotateLeft();
                    }
                    if(isGrandParentRoot) {
                        thisRef._root = pGrandParentOfTarget._parent;
                    }

                    pCurrent = null;
                }
            }
            else {
                pCurrent = null;
            }
        }
    }

    /**
     *  @template T
     *  @param {RbTreeSet<T>} thisRef
     *  @param {RbTreeNode<T>} replacement
     *  @param {RbTreeNode<T>} pParentOfReplacement
     */
    function RbTreeSet_rebalanceAfterRemoval(thisRef, replacement, pParentOfReplacement)
    {
        if(replacement._red) {
            replacement._red = false;
        }
        else for(
            var pCurrent = replacement, pParentOfCurrent = pParentOfReplacement;
            pCurrent !== null;
        ) {
            if(pParentOfCurrent === null) {
                thisRef._root = pCurrent;

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
    }

    /**
     *  @template T
     *  @this {RbTreeSet<T>}
     *  @param {RbTreeNode<T>} node
     */
    function RbTreeSet_traversalHandlerOfRemoveAll(node)
    {
        RbTreeSet_destructNode(this, node);
    }

    if(_isSymbolSupported) {
        RbTreeSet.prototype[Symbol.iterator] = RbTreeSet.prototype.values;

        RbTreeSet.prototype[Symbol.toStringTag] = "RbTreeSet";
    }

    /**
     *  @template T
     *  @constructor
     *  @param {RbTreeSet<T>} rbTreeSet
     */
    function PairIterator(rbTreeSet)
    {
        this._rbTreeSet = rbTreeSet;
        this._iter = rbTreeSet.begin();
    }

    PairIterator.prototype = {
        constructor : PairIterator,

        next()
        {
            /** @type {IteratorReturnResult<[T, T]>} */var result = {
                done : this._iter.equals(this._rbTreeSet.end()),
                value : void 0,
            };

            if(!result.done) {
                var value = this._iter.dereference();
                result.value = [value, value];

                this._iter.moveToNext();
            }

            return result;
        },
    };

    if(_isSymbolSupported) {
        PairIterator.prototype[Symbol.iterator] = function ()
        {
            return this;
        };
    }

    /**
     *  @template T
     *  @constructor
     *  @param {RbTreeSet<T>} rbTreeSet
     */
    function ValueIterator(rbTreeSet)
    {
        this._rbTreeSet = rbTreeSet;
        this._iter = rbTreeSet.begin();
    }

    ValueIterator.prototype = {
        constructor : ValueIterator,

        next()
        {
            /** @type {IteratorReturnResult<T>} */var result = {
                done : this._iter.equals(this._rbTreeSet.end()),
                value : void 0,
            };

            if(!result.done) {
                result.value = this._iter.dereference();

                this._iter.moveToNext();
            }

            return result;
        },
    };

    if(_isSymbolSupported) {
        ValueIterator.prototype[Symbol.iterator] = function ()
        {
            return this;
        };
    }

    return RbTreeSet;
})();

module.exports = {
    RbTreeSet : RbTreeSet,
};